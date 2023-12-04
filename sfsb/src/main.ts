
import App from './App.vue'
import {createApp} from 'vue'

import {registerPlugins} from '@/plugins'
import keycloakService from './plugins/keycloak/service';
const app = createApp(App)

keycloakService.init().then(() => {
  registerPlugins(app);
  app.mount("#app");
}).catch(console.log);

app.config.globalProperties.$keycloakService = keycloakService;
console.log(process.env.BASE_URL);
