import App from "./App.vue";
import { createApp } from "vue";

import { registerPlugins } from "@/plugins";
import { registerDirectives } from "@/directives";

const app = createApp(App);

registerPlugins(app)
registerDirectives(app)

app.config.globalProperties.$defaultColor = "#2F477E";
app.mount("#app")
