<!-- @format -->
<template>
  <div ref="wrapper">
    <Comp />
  </div>
</template>
<script setup lang="ts">
import * as Vue from 'vue';
import * as serverRenderer from 'vue/server-renderer';

import { defineAsyncComponent, type Component } from 'vue';
// Vue 的服务端渲染 API 位于 `vue/server-renderer` 路径下
import { isClient } from '@/utils';
import { parser } from '@/transform';
import { sfcPlugin } from '@mdit-vue/plugin-sfc';
import { componentPlugin } from '@mdit-vue/plugin-component';
import MarkdownIt from 'markdown-it';

defineOptions({
  name: 'MarkVue',
});
const props = withDefaults(
  defineProps<{
    content: string;
    context?: any;
    mdi?: MarkdownIt;
  }>(),
  {
    content: '',
    context: {
      vue: Vue,
      'vue/server-renderer': serverRenderer,
    },
  }
);

props.mdi
  ?.use(componentPlugin, {
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

const Comp = defineAsyncComponent((): Promise<Component> => {
  return new Promise((resolve) => {
    const compose = (component: any): Component => {
      const id = component.id;
      if (!globalCached.__MarkVueModules__[id]) {
        globalCached.__MarkVueModules__[id] = {};
      }
      eval(component.script!);
      const scriptRet =
        globalCached.__MarkVueModules__[id]?.getScript?.(props.context) || null;
      return {
        __scopeId: `data-v-${id}`,
        ...scriptRet,
      };
    };
    parser(globalCached.name, props.mdi!, props.content, !isClient).then(
      ({ rewriteComponent }) => {
        resolve(compose(rewriteComponent));
      }
    );
  });
});
</script>
