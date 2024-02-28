<template>
    <v-app>
        <navbar />
        <v-progress-circular v-if="!user" indeterminate :color="$defaultColor" class="is-not-user" :size="62" :width="6"/>
        <router-view v-else/>
    </v-app>
</template>

<script setup lang="ts">
import Navbar from "@/components/Navbar.vue";
import { useTheme } from "vuetify";
import { watch } from "vue";
import { useThemeStore } from "@/pinia-store/themeSwitcher"
import { storeToRefs } from "pinia";
import {useCurrentUserStore} from "@/pinia-store/currentUser";

const { theme } = storeToRefs(useThemeStore())
const { setDark, setLight } = useThemeStore()
const themeGlobal = useTheme()
const isLight = () => matchMedia("(prefers-color-scheme: light)").matches
isLight() ? setLight() : setDark()

const {user} = storeToRefs(useCurrentUserStore())

watch(theme, () => {
    themeGlobal.global.name.value = theme.value ? "dark" : "light"
}, { immediate: true })
</script>


<style lang="sass">
.v-toolbar__content
    height: 32px !important

.is-not-user
    position: absolute
    top: 50%
    right: 50%
    translate: 50% -50%

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
