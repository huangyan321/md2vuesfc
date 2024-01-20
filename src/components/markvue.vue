<!-- @format -->

<template>
  <div ref="wrapper">
    <Comp />
  </div>
</template>
<script setup lang="ts">
import * as Vue from 'vue';
import * as serverRenderer from 'vue/server-renderer';

import { defineAsyncComponent, type Component, h } from 'vue';
// Vue 的服务端渲染 API 位于 `vue/server-renderer` 路径下
import { isClient } from '@/utils';
import { parser } from '@/transform';
import { sfcPlugin } from '@mdit-vue/plugin-sfc';
import { componentPlugin } from '@mdit-vue/plugin-component';
import type MarkdownIt from 'markdown-it';
import markdownIt from 'markdown-it';
defineOptions({
  name: 'MarkVue',
});
interface IProps {
  content: string;
  context: {
    components?: {
      [key: string]: Component;
    };
    [key: string]: any;
  };
  markdownIt?: MarkdownIt;
}
const props = withDefaults(defineProps<IProps>(), {
  content: '',
  context: () => ({}),
});
const mdi = props.markdownIt || markdownIt({ html: true });
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
const insertStyles = (component: any) => {
  const styleTag = document.createElement('style');
  styleTag.innerHTML = component.style!;
  styleTag.id = `markvue-styles`;
  document.head.appendChild(styleTag);
};
const Comp = defineAsyncComponent((): Promise<Component> => {
  return new Promise((resolve) => {
    const compose = (component: any): Component => {
      const id = component.id;
      if (!component.success) {
        return {
          __scopeId: `data-v-${id}`,
          render() {
            return h('div', {
              innerHTML: component.rendered,
            });
          },
        };
      }
      if (!globalCached.__MarkVueModules__[id]) {
        globalCached.__MarkVueModules__[id] = {};
      }
      eval(component.script!);
      const contextProxy = new Proxy(props.context, {
        get(target, key, receiver) {
          if (key === 'vue') {
            return Vue;
          }
          if (key === 'vue/server-renderer') {
            return serverRenderer;
          }
          return Reflect.get(target, key, receiver);
        },
      });
      const scriptRet =
        globalCached.__MarkVueModules__[id]?.getScript?.(contextProxy) || null;

      return {
        ...scriptRet,
      };
    };
    parser(globalCached.name, mdi, props.content, !isClient).then(
      ({ rewriteComponent }) => {
        isClient && insertStyles(rewriteComponent);
        resolve(compose(rewriteComponent));
      }
    );
  });
});
</script>
