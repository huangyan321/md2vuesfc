<!-- @format -->

<template>
  <div>{{ counter }}</div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
defineOptions({
  name: 'MarkVue',
});
const counter = ref('你好');
</script>
<style lang="scss" scoped></style>
