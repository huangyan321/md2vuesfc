/** @format */

export const demoContent = `# {{ count }}
<button @click="add">add</button>
## Subtitle

Here's some content.

Next is a Vue SFC (counter).


<script setup>
import { ref } from 'vue';

const count = ref(0);

const add = () => {
  count.value++
}
</script>
## 你好

<style scoped>
button {
  padding: 6px 18px;
  background: #41aeff;
  color: #fff;
  font-weight: 600;
  border-radius: 6px;
  border: none;
  cursor: pointer;
}
</style>`;
