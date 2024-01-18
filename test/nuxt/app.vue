<!-- @format -->

<template>
  <div>
    <ClientOnly>
      <MarkVue :mdi="md" :content="demoContent"></MarkVue>
    </ClientOnly>
  </div>
</template>
<script setup lang="ts">
import { demoContent } from '../demo';
import MarkdownIt from 'markdown-it';
const md = MarkdownIt({ html: true });
</script>
