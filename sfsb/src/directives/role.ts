import { Directive } from "vue";
import { useCurrentUserStore } from "@/pinia-store/currentUser";

const role: Directive<HTMLElement> = {
    async mounted(el, { value: userRole, arg }) {
        const isNot = arg === "not";

        let isMatch = false;
        const { user } = useCurrentUserStore();

        if (Array.isArray(userRole)) {
            isMatch =
                !!user && userRole.some((role) => user.roles?.includes(role));
        } else {
            isMatch =
                !!user && user.roles.some((role: string) => role === userRole);
        }

        if (isNot ? isMatch : !isMatch) {
            el.setAttribute("untouchable", "true");
        }
    },
};

export default role;
