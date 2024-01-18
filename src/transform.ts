/** @format */
import MarkdownIt from 'markdown-it';
import type { MarkDownEnv } from './types/md';

import { createVueSFCModule } from './compiler';
import hashId from 'hash-sum';

export async function parser(mdi: MarkdownIt, code: string) {
  const id = hashId('anonymous');
  const env = {} as MarkDownEnv;
  let component = {
    id,
    js: '',
    css: '',
    ssr: '',
    template: '',
  };
  mdi?.render(code, env);
  const { sfcBlocks: descriptor } = env;
  const error = await createVueSFCModule(descriptor, component);
  if (error) {
    throw new Error(error.join('\n'));
  }
  const rewriteComponent = {
    id,
    style: component.css,
    script: transformScriptCode(id, component.js),
    template: transformTemplateCode(id, component.template),
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
      /export/gi,
      'return'
    )}\n} })()`;
  }
  return '';
};
