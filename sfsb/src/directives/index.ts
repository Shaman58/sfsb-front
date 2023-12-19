import { App } from "vue";
import role from "./role";

export const registerDirectives=(app:App<Element>) => {
    app.directive("role", role);
}
