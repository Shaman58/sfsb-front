import { Directive, DirectiveBinding } from "vue";
import { useCurrentUserStore } from "@/pinia-store/currentUser";

const effectMap: { [key: string]: (el: HTMLElement) => void } = {
    ["contarst"]: (el: HTMLElement) => {
        el.setAttribute("untouchable", "true");
    },
    ["hide"]: (el: HTMLElement) => {
        el.setAttribute("hidden", "hidden");
    },
};

const role: Directive<HTMLElement> = {
    async mounted(el, { value: userRole, arg, modifiers }: DirectiveBinding) {
        console.log(modifiers);
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
            Object.keys(modifiers).forEach((key) => {
                if (key in effectMap) effectMap[key](el);
            });
        }
    },
};

export default role;
