/** @format */
import MarkVue from './components/markvue.vue';
import type { App } from 'vue';
const installer = (app: App): any => {
  app.component(MarkVue.name, MarkVue);
};
export { MarkVue };
export default installer;
export type { MarkDownEnv } from './types/md';
export * from './compiler';
export * from './transform';
import { default as juice } from 'juice';
export { juice };
