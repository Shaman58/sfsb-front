import { Directive } from "vue";
import keycloakService from "@/plugins/keycloak/service";

const role: Directive<HTMLElement> = {
    async mounted(el, { value: userRole, arg }) {
        const isNot = arg === "not";

        let isMatch = false;
        const user = await keycloakService.keycloak.loadUserProfile();
        if (Array.isArray(userRole)) {
            isMatch = user.roles.every((role) => userRole.includes(role));
        } else {
            isMatch = user.roles.some((role: string) => role === userRole);
        }

        if (isNot ? isMatch : !isMatch) {
            el.style.display = "none";
        }
    },
};

export default role;
