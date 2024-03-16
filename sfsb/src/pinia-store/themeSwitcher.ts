import { defineStore } from "pinia";
import {  ref } from "vue";


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
