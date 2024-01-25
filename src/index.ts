/** @format */
import MarkVue from './components/markvue.vue';
import type { App } from 'vue';
const installer = (app: App): any => {
  app.component(MarkVue.name, MarkVue);
};
export { MarkVue };
export default installer;

