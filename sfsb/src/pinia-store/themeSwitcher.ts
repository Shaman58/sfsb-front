import { defineStore, storeToRefs } from "pinia";
import api from "@/api/instance";
import { useToast } from "vue-toast-notification";
import { Ref, ref } from "vue";

const toast = useToast();

export const useThemeStore = defineStore("theme", () => {
    const theme = ref<boolean>(false);

    const setLight = () => {
        theme.value = false;
    };
    const setDark = () => {
        theme.value = true;
    };
    const toggleTheme = () => {
        theme.value = !theme.value;
    };

    return {
        theme,
        setDark,
        setLight,
        toggleTheme,
    };
});
