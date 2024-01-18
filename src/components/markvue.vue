<!-- @format -->
<template>
  <div ref="wrapper" id="airport"></div>
</template>
<script setup lang="ts">
import * as Vue from 'vue';
import * as serverRenderer from 'vue/server-renderer';
import { ref, onMounted, createApp } from 'vue';
import { parser } from '@/transform';
import { sfcPlugin } from '@mdit-vue/plugin-sfc';
import { componentPlugin } from '@mdit-vue/plugin-component';
import MarkdownIt from 'markdown-it';

interface ExtendedWindow extends Window {
  __MarkVueModules__?: {
    [key: string]: {
      getScript?: (context: Record<string, unknown>) => any;
      getTemplate?: (context: Record<string, unknown>) => any;
    };
  };
}
defineOptions({
  name: 'MarkVue',
});
const props = withDefaults(
  defineProps<{
    content: string;
    context: any;
    ssr?: boolean;
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
  .use(sfcPlugin, {
    customBlocks: ['vue-sfc', 'script'],
  });

const extendedWindow: ExtendedWindow = window;
if (!extendedWindow.__MarkVueModules__) {
  extendedWindow.__MarkVueModules__ = {};
}

const wrapper = ref<HTMLDivElement>();
const insertStyles = (component: any) => {
  const styleTag = document.createElement('style');
  styleTag.innerHTML = component.style!;
  styleTag.id = `markvue-styles`;
  document.head.appendChild(styleTag);
};
const compose = (component: any) => {
  if (!extendedWindow.__MarkVueModules__!['anonymous.vue']) {
    extendedWindow.__MarkVueModules__!['anonymous.vue'] = {};
  }
  eval(component.script!);
  eval(component.template!);
  const scriptRet =
    extendedWindow.__MarkVueModules__!['anonymous.vue']?.getScript?.(
      props.context
    ) || null;
  const render =
    extendedWindow.__MarkVueModules__!['anonymous.vue']?.getTemplate?.(
      props.context
    ) || null;
  console.log({
    __scopeId: `data-v-anonymous.vue`,
    ...scriptRet,
    render,
  });

  return {
    __scopeId: `data-v-anonymous.vue`,
    ...scriptRet,
    render,
  };
};
const init = async () => {
  if (!wrapper.value) {
    console.warn('[md2vuesfc]: cannot access the wrapper element');
  }
  const { rewriteComponent } = await parser(props.mdi!, props.content);
  insertStyles(rewriteComponent);

  const vm = createApp(compose(rewriteComponent));
  vm.mount(`#airport`);
};

onMounted(() => {
  init();
});
</script>
<style lang="scss" scoped></style>
