/** @format */
import MarkVue from './components/markvue.vue';
import type { App } from 'vue';
const install = (app: App): any => {
  app.component(MarkVue.name, MarkVue);
};
export { MarkVue };
export default install;
export type { MarkDownEnv } from './types/md';
export * from './compiler';
export * from './transform';
