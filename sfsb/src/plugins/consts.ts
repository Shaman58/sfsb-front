import {App} from "vue";
import navItems from "@consts/mainmenu";
import operations from "@consts/operatiions";
import geometries from "@consts/geometries";


export default {
    install: (app: App<Element>) => {
        app.config.globalProperties.$geometries = geometries;
        app.config.globalProperties.$operations = operations
        app.config.globalProperties.$navItems = navItems

    }
}
