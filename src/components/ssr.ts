/** @format */

import * as Vue from 'vue';
import * as serverRenderer from 'vue/server-renderer';
import { createSSRApp } from 'vue';
import { renderToString } from 'vue/server-renderer';
import MarkdownIt from 'markdown-it';
import { parser } from '../transform';
import { sfcPlugin } from '@mdit-vue/plugin-sfc';
import { componentPlugin } from '@mdit-vue/plugin-component';
import { demoContent } from '../../test/demo';
const context = {
  vue: Vue,
  'vue/server-renderer': serverRenderer,
};
const mdi = MarkdownIt({ html: true });
mdi
  .use(componentPlugin, {
    // options
  })
  .use(sfcPlugin);
const globalCached: {
  name: string;
  __MarkVueModules__: {
    [key: string]: {
      getScript?: (context: Record<string, unknown>) => any;
    };
  };
} = {
  name: 'globalCached',
  __MarkVueModules__: {},
};
if (!globalCached.__MarkVueModules__) {
  globalCached.__MarkVueModules__ = {};
}
const compose = (component: any) => {
  const id = component.id;
  if (!globalCached.__MarkVueModules__![id]) {
    globalCached.__MarkVueModules__![id] = {};
  }
  eval(component.script!);
  const scriptRet =
    globalCached.__MarkVueModules__![id]?.getScript?.(context) || null;
  return {
    __scopeId: `data-v-${id}`,
    ...scriptRet,
  };
};
async function init() {
  const { rewriteComponent } = await parser(
    globalCached.name,
    mdi!,
    demoContent,
    true
  );
  // console.log(rewriteComponent.script);

  const vm = createSSRApp(compose(rewriteComponent));
  renderToString(vm).then((html) => {
    console.log(html);
  });
}
init();
