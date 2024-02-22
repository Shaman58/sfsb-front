import App from "./App.vue";
import ErrorKeycloack from "./ErrorKeycloack.vue";
import { createApp } from "vue";

import { registerPlugins } from "@/plugins";
import { registerDirectives } from "@/directives";
import keycloakService from "@/plugins/keycloak/service.mjs";
import FallbackApp from "./FallbackApp.vue";

const app = createApp(App);
const errorPage = createApp(ErrorKeycloack);
const fallback = createApp(FallbackApp);

fallback.mount("#app");

keycloakService
    .init()
    .then(() => {
        fallback.unmount();
        registerPlugins(app);
        registerDirectives(app);
        app.mount("#app");
        console.log(keycloakService.getTocken());
    })
    .catch((error: unknown) => {
        fallback.unmount();
        console.log(error);
        errorPage.mount("#app");
    });

app.config.globalProperties.$keycloakService = keycloakService;
app.config.globalProperties.$defaultColor = "#2F477E";
console.log(import.meta.env.BASE_URL);
