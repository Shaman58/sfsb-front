/**
 * plugins/index.js
 *
 * Automatically included in `./src/main.js`
 */

// Plugins
import vuetify from "./vuetify";
import router from "@/router/";
import piniaStore from "./piniaStore";
import {App} from "vue";
import consts from "@/plugins/consts";
import { vueKeycloak } from '@josempgon/vue-keycloak'
import config from "@/plugins/keycloak/config";

export function registerPlugins(app: App<Element>) {
    // app.use(vuetify).use(router).use(store).use(piniaStore);
    app.use(vueKeycloak,{config},{
        onLoad: 'login-required',
    }).use(vuetify).use(router).use(consts).use(piniaStore);
}
