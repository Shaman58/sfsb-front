/**
 * plugins/index.js
 *
 * Automatically included in `./src/main.js`
 */

// Plugins
import vuetify from "./vuetify";
import router from "@/router/";
import store from "../store/index.js";
import piniaStore from "./piniaStore";
import { App, Plugin } from "vue";
import keycloakService from "@/plugins/keycloak/service.mjs";

const currentUser: Plugin = {
    install: (app: App) => {
        app.config.globalProperties.$user = { id: "kjlkjlkjlkjlkj" };
        // app.config.globalProperties.$user = await keycloakService.keycloak.loadUserProfile();
        console.log("from plugin", app.config.globalProperties.$user);
    },
};

export function registerPlugins(app: App<Element>) {
    app.use(vuetify).use(router).use(store).use(piniaStore).use(currentUser);
}
