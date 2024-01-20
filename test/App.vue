<!-- @format -->

<script setup lang="ts">
import { demoContent } from './demo';
import MarkdownIt from 'markdown-it';
import HelloWorld from './helloworld.vue';
const md = MarkdownIt({ html: true });
</script>

<template>
  <div>
    <MarkVue
      :markdown-it="md"
      :content="demoContent"
      :context="{
        components: {
          helloworld: HelloWorld,
        },
      }"
    ></MarkVue>
  </div>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
