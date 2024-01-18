/** @format */
import MarkdownIt from 'markdown-it';
export interface Template {
  type: string;
  content: string;
  contentStripped: string;
  tagOpen: string;
  tagClose: string;
}

export interface ScriptSetup {
  content: string;
  tagOpen: string;
  type: string;
  contentStripped: string;
  tagClose: string;
}

export interface Script {
  content: string;
  tagOpen: string;
  type: string;
  contentStripped: string;
  tagClose: string;
}

export interface Style {
  content: string;
  tagOpen: string;
  type: string;
  contentStripped: string;
  tagClose: string;
  scoped?: boolean;
}

export interface SfcBlock {
  template: Template;
  script?: any;
  scriptSetup: ScriptSetup;
  scripts: Script[];
  styles: Style[];
  customBlocks: any[];
}

export interface MarkDownEnv {
  sfcBlocks: SfcBlock;
}

import { createVueSFCModule } from './compiler';
export async function parser(mdi: MarkdownIt, code: string) {
  const env = {} as MarkDownEnv;
  let component = {
    js: '',
    css: '',
    ssr: '',
    template: '',
  };
  mdi?.render(code, env);
  const { sfcBlocks: descriptor } = env;
  await createVueSFCModule(descriptor, component);
  const rewriteComponent = {
    style: component.css,
    script: transformScriptCode('anonymous.vue', component.js),
    template: transformTemplateCode('anonymous.vue', component.template),
  };
  return { rewriteComponent };
}
const IMPORT_REGEX = /import\s+(.+)\s+from\s*["'](.+)["'];?/gi;

const transformImports = (script: string) => {
  const importMatches = [...script.matchAll(IMPORT_REGEX)].map((item) => {
    let namedImport = false;
    return {
      matched: item[0],
      imported: item[1]
        .split(',')
        .map((part: string) => {
          if (part.includes('{')) {
            namedImport = true;
          }
          const formatted = part.replace('{', '').replace('}', '').trim();
          const ret = namedImport ? `{ ${formatted} }` : formatted;
          if (part.includes('}')) {
            namedImport = false;
          }
          return ret;
        })
        .map((importedComponent: string) => {
          let formatted = importedComponent.trim();
          if (formatted.startsWith('{')) {
            formatted = formatted.replace('{', '').replace('}', '').trim();
            if (formatted.includes('as')) {
              const containAlias = formatted
                .split('as')
                .map((part) => part.trim());
              return containAlias;
            }
            return `{ ${formatted} }`;
          } else {
            return formatted;
          }
        }),
      from: item[2],
    };
  });
  let ret = script;
  importMatches.forEach((match) => {
    const transformed = match.imported.map((imported) => {
      if (Array.isArray(imported)) {
        return `const ${imported[1] || imported[0]} = context['${
          match.from
        }']['${imported[0]}']`;
      }
      return `const ${imported} = context['${match.from}']`;
    });
    ret = ret.replace(match.matched, transformed.join('\n'));
  });
  return ret;
};
function transformScriptCode(id: string, script: string) {
  const importTransformed = transformImports(script).trim();
  if (importTransformed) {
    return `(function() { window.__MarkVueModules__['${id}'].getScript = function (context) {\n${importTransformed.replace(
      'export default',
      'return'
    )}\n}; })()`;
  }
  return '';
}
const transformTemplateCode = (id: string, script: string) => {
  const importTransformed = transformImports(script).trim();
  if (importTransformed) {
    return `(function() { window.__MarkVueModules__['${id}'].getTemplate = function (context) {\n${importTransformed.replace(
      'export',
      'return'
    )}\n} })()`;
  }
  return '';
};
