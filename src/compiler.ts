/** @format */
import {
  compileScript,
  compileTemplate,
  rewriteDefault,
  compileStyleAsync,
  parse,
  type CompilerOptions,
  type SFCDescriptor,
  type SFCTemplateCompileOptions,
  type BindingMetadata,
} from 'vue/compiler-sfc';
import type { SfcBlock } from './types/md';
import { transform } from 'sucrase';
import { inlineContent } from 'juice';
const COMP_IDENTIFIER = '__sfc__';
async function transformTS(src: string) {
  return transform(src, {
    transforms: ['typescript'],
  }).code;
}
export async function createVueSFCModule(
  sfcBlock: SfcBlock,
  component: {
    id: string;
    js: string;
    css: string;
    ssr: string;
  }
) {
  const id = component.id;
  const sfc = concatModules(sfcBlock);
  const { descriptor } = parse(sfc);
  if (
    descriptor.styles.some((s) => s.lang) ||
    (descriptor.template && descriptor.template.lang)
  ) {
    return [
      `lang="x" pre-processors for <template> or <style> are currently not ` +
        `supported.`,
    ];
  }
  const scriptLang =
    (descriptor.script && descriptor.script.lang) ||
    (descriptor.scriptSetup && descriptor.scriptSetup.lang);

  const isTS = scriptLang === 'ts';
  if (scriptLang && !isTS) {
    return [`Only lang="ts" is supported for <script> blocks.`];
  }
  const hasScoped = descriptor.styles.some((s) => s.scoped);
  let clientCode = '';
  let ssrCode = '';

  const appendSharedCode = (code: string) => {
    clientCode += code;
    ssrCode += code;
  };

  let clientScript: string;
  let bindings: any;
  try {
    [clientScript, bindings] = await doCompileScript(
      descriptor,
      component.id,
      false,
      isTS
    );
  } catch (e: any) {
    return [e.stack.split('\n').slice(0, 12).join('\n')];
  }

  clientCode += clientScript;

  // script ssr needs to be performed if :
  // 1.using <script setup> where the render fn is inlined.
  // 2.using cssVars, as it do not need to be injected during SSR.
  if (descriptor.scriptSetup || descriptor.cssVars.length > 0) {
    try {
      const ssrScriptResult = await doCompileScript(
        descriptor,
        component.id,
        true,
        isTS
      );
      ssrCode += ssrScriptResult[0];
    } catch (e) {
      ssrCode = `/* SSR compile error: ${e} */`;
    }
  } else {
    // the script result will be identical.
    ssrCode += clientScript;
  }

  if (descriptor.template && !descriptor.scriptSetup) {
    const clientTemplateResult = await doCompileTemplate(
      descriptor,
      id,
      bindings,
      false,
      isTS
    );
    if (Array.isArray(clientTemplateResult)) {
      return clientTemplateResult;
    }
    clientCode += `;${clientTemplateResult}`;
    const ssrTemplateResult = await doCompileTemplate(
      descriptor,
      id,
      bindings,
      true,
      isTS
    );
    if (typeof ssrTemplateResult === 'string') {
      // ssr compile failure is fine
      ssrCode += `;${ssrTemplateResult}`;
    } else {
      ssrCode = `/* SSR compile error: ${ssrTemplateResult[0]} */`;
    }
  }

  if (hasScoped) {
    appendSharedCode(
      `\n${COMP_IDENTIFIER}.__scopeId = ${JSON.stringify(`data-v-${id}`)}`
    );
  }

  let css = '';
  let styles: string[] = [];

  for (const style of descriptor.styles) {
    if (style.module) {
      return [`<style module> is not supported.`];
    }

    const styleResult = await compileStyleAsync({
      source: style.content,
      filename: component.id,
      id: component.id,
      scoped: style.scoped,
      modules: !!style.module,
      trim: true,
      isProd: false,
    });
    if (styleResult.errors.length) {
      // postcss uses pathToFileURL which isn't polyfilled in the browser
      // ignore these errors for now
      if (!styleResult.errors[0].message.includes('pathToFileURL')) {
      }
      // proceed even if css compile errors
    } else {
      styles.push(styleResult.code);
      css += styleResult.code + '\n';
    }
  }
  if (css) {
    component.css = css.trim();
  } else {
    component.css = '/* No <style> tags present */';
  }
  if (clientCode || ssrCode) {
    const ceStyles = styles.length
      ? `\n${COMP_IDENTIFIER}.styles = ${JSON.stringify(styles)}`
      : '';

    appendSharedCode(
      `\n${COMP_IDENTIFIER}.__file = '${String(id)}'` +
        ceStyles +
        `\nreturn ${COMP_IDENTIFIER}`
    );
    component.js = clientCode.trimStart();
    component.ssr = ssrCode.trimStart();
  }
  return [];
}
function concatModules(sfcBlock: SfcBlock) {
  const { scripts, styles, template } = sfcBlock;

  const s = scripts.reduce((p, c) => {
    return (p += c.content);
  }, '');
  const c = styles.reduce((p, c) => {
    return (p += c.content);
  }, '');
  let t = template.content || '';
  if (c) {
    t = inlineContent(t, c);
  }
  // 拼接完整的sfc字符串
  const sfc = `${t}\n${s}\n${c}`;
  return sfc;
}
async function doCompileScript(
  descriptor: SFCDescriptor,
  id: string,
  ssr: boolean,
  isTS: boolean
) {
  if (descriptor.script || descriptor.scriptSetup) {
    const expressionPlugins: CompilerOptions['expressionPlugins'] = isTS
      ? ['typescript']
      : undefined;
    const templateOptions: SFCTemplateCompileOptions = {
      filename: id,
      source: descriptor.template?.content || '',
      id: id,
      isProd: false,
      slotted: false,
      ssr,
      ssrCssVars: descriptor.cssVars,
      scoped: descriptor.styles.some((s) => s.scoped),
      compilerOptions: {
        parseMode: 'sfc',
        mode: 'module',
        expressionPlugins,
      },
    };
    const compiledScript = compileScript(descriptor, {
      isProd: false,
      id,
      inlineTemplate: true,
      templateOptions: templateOptions,
    });
    let code = '';

    if (compiledScript.bindings) {
      code += `\n/* Analyzed bindings: ${JSON.stringify(
        compiledScript.bindings,
        null,
        2
      )} */`;
    }
    code +=
      `\n` +
      rewriteDefault(
        compiledScript.content,
        COMP_IDENTIFIER,
        expressionPlugins
      );
    if ((descriptor.script || descriptor.scriptSetup)!.lang === 'ts') {
      code = await transformTS(code);
    }
    return [code, compiledScript.bindings] as const;
  } else {
    return [`\nconst ${COMP_IDENTIFIER} = {}`, undefined] as const;
  }
}
async function doCompileTemplate(
  descriptor: SFCDescriptor,
  id: string,
  bindingMetadata: BindingMetadata | undefined,
  ssr: boolean,
  isTS: boolean
) {
  let { code, errors } = compileTemplate({
    isProd: false,
    ast: descriptor.template!.ast,
    source: descriptor.template!.content,
    filename: id,
    id,
    scoped: descriptor.styles.some((s) => s.scoped),
    ssr,
    ssrCssVars: descriptor.cssVars,
    compilerOptions: {
      bindingMetadata,
      expressionPlugins: isTS ? ['typescript'] : undefined,
    },
  });
  if (errors.length) {
    return errors;
  }
  const fnName = ssr ? `ssrRender` : `render`;
  code =
    `\n${code.replace(
      /\nexport (function|const) (render|ssrRender)/,
      `$1 ${fnName}`
    )}` + `\n${COMP_IDENTIFIER}.${fnName} = ${fnName}`;
  if ((descriptor.script || descriptor.scriptSetup)?.lang === 'ts') {
    code = await transformTS(code);
  }
  return code;
}
