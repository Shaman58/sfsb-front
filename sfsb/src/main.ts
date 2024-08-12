import App from "./App.vue";
import { createApp } from "vue";

import { registerPlugins } from "@/plugins";
import { registerDirectives } from "@/directives";

const app = createApp(App);

registerPlugins(app);
registerDirectives(app);

app.config.globalProperties.$defaultColor = "#2F477E";
app.config.globalProperties.$MIN_TIMELINE = 15 * 60 * 1000;
app.config.globalProperties.$MIN_TIMELINE_PX = "30px";
app.mount("#app");
