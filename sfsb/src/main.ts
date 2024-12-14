import App from "./App.vue";
import { createApp } from "vue";

import { registerPlugins } from "@/plugins";
import { registerDirectives } from "@/directives";
import { Calendar, DatePicker } from 'v-calendar';
import 'v-calendar/style.css';

const app = createApp(App);

registerPlugins(app)
registerDirectives(app)


app.config.globalProperties.$defaultColor = "#2F477E";
app.component('VCalendar', Calendar)
app.component('VDatePicker', DatePicker)
app.mount("#app")
