/** @format */

import markvue from 'md2vuesfc';
export default defineNuxtPlugin((nuxtApp) => {
  // Doing something with nuxtApp
  nuxtApp.vueApp.use(markvue);
});
