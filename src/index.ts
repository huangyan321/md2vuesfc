/** @format */
import MarkVue from './components/markvue.vue';
import type { App } from 'vue';
const installer = (app: App) => {
  app.component(MarkVue.name, MarkVue);
};

export default installer;
