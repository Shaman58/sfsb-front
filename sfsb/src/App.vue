<template>
    <v-app>
        <navbar />
        <router-view />
    </v-app>
</template>

<script setup lang="ts">
import Navbar from "@/components/Navbar.vue";
import { useTheme } from "vuetify";
import { watch } from "vue";
import { useThemeStore } from "@/pinia-store/themeSwitcher"
import { storeToRefs } from "pinia";

const { theme } = storeToRefs(useThemeStore())
const { setDark, setLight } = useThemeStore()
const themeGlobal = useTheme()
const isLight = () => matchMedia("(prefers-color-scheme: light)").matches
isLight() ? setLight() : setDark()

watch(theme, () => {
    themeGlobal.global.name.value = theme.value ? "dark" : "light"
}, { immediate: true })
</script>


<style lang="sass">
.v-toolbar__content
    height: 32px !important

[untouchable="true"]
    opacity: 0.5
    & *
        pointer-events: none
        user-select: none

.v-container
    @media (width < 1024px)
        padding: 1em

.v-card-text
    @media (width < 1024px)
        padding: 6px

[class*="v-col-"]
    @media (width < 1024px)
        padding: 2px
</style>
