# MD2VueSFC

A Vue3 component that allows you to **parse markdown at runtime** and **mix vue-sfc into it**. It is **SSR-friendly**, inspired by [markvue](https://github.com/backrunner/markvue) and [vuejs/repl](https://github.com/vuejs/repl).

## How to use

1: Install the package:

```js
npm install md2vuesfc --save
```

2: Import it to your project:

```js

import { createApp } from 'vue';
import App from './App.vue';

import md2vuesfc from 'md2vuesfc';

const app = createApp(App)

app.use(md2vuesfc)

app.mount('#app');
```

3: Use it in your pages:

create a markdown string:

```ts
// ./demo.ts
export const demoContent =
  `# {{ count }}
<button @click="add">add</button>
## Subtitle

Here's some content.

Next is a Vue SFC (counter).


<script setup lang="ts">
import { ref } from 'vue';
const count = ref(0);
const add = () => {
  count.value++
}
</script>

## Intro

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
</style>`

```

use it:

```vue

<script setup lang="ts">
import { demoContent } from './demo';
import HelloWorld from './helloworld.vue';
</script>

<template>
  <div>
    <MarkVue
      :content="demoContent"
    />
  </div>
</template>

```

## advanced usage

### Customize markdown behavior

The component uses markdown-it library internally, you can pass in the markdown-it instance as prop, and before that you can customize its behavior.

```vue
<!-- @format -->

<script setup lang="ts">
import { demoContent } from './demo';
import MarkdownIt from 'markdown-it';
import HelloWorld from './helloworld.vue';
import anchor from 'markdown-it-anchor';

const md = MarkdownIt({ html: true }).use(anchor);
</script>

<template>
  <div>
    <MarkVue
      :markdown-it="md"
      :content="demoContent"
    ></MarkVue>
  </div>
</template>
```

### Use vue components inside markdown

You can use components in Markdown like this

```ts
// ./demo.ts
export const demoContent =
  `# {{ count }}
<button @click="add">add</button>
<helloworld></helloworld>
## Subtitle

Here's some content.

Next is a Vue SFC (counter).


<script setup>
import { ref } from 'vue';
import { helloworld } from 'components'
const count = ref(0);
const add = () => {
  count.value++
}
</script>

## Intro

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
</style>`

```

Pass in the corresponding component as prop

```vue
<!-- @format -->

<script setup lang="ts">
import { demoContent } from './demo';
import HelloWorld from './helloworld.vue';
</script>

<template>
  <div>
    <MarkVue
      :content="demoContent"
      :context="{
        components: {
          helloworld: HelloWorld,
        },
      }"
    ></MarkVue>
  </div>
</template>

```

## Features

Supported SFC Features:

- ts lang

- script

- script setup

- Scoped styles

- SSR

Unsupported SFC Features:

- Style Preprocessors
