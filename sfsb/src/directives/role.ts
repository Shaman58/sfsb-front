import { Directive } from "vue";
import keycloakService from "@/plugins/keycloak/service";

const role: Directive<HTMLElement> = {
    async mounted(el, {value,arg}) {
        const isNot = arg === "not";
        const userRole = value; //TODO: возможно передача значения как массива?

        const user = await keycloakService.keycloak.loadUserProfile();

        const isMatch = user.roles.some((role: string) => role === userRole);

        if (isNot ? isMatch :!isMatch) {
            el.style.display = "none";
        }
    },
};

export default role;

