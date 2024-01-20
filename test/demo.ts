/** @format */

export const demoContent = `# {{ count }}
<button @click="add">add</button>
<helloworld></helloworld>
## Subtitle

Here's some content.

Next is a Vue SFC (counter).


<script lang="ts">
import { ref,type Ref } from 'vue';
import { helloworld } from 'components'
export default {
  components: {
    helloworld
  },
  setup(){
    const count:Ref<number> = ref(0);
    const add = () => {
    count.value++
  }
    return {
      count,
      add
    }
  }
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
