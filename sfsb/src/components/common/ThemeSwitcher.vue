<template lang="pug">
.theme-switch
    v-icon( icon="mdi:mdi-white-balance-sunny")
    v-switch(v-model="theme" hide-details inset)
    v-icon( icon="mdi:mdi-weather-night")

</template>

<script setup lang="ts">
import { useThemeStore } from '@/pinia-store/themeSwitcher';
import { storeToRefs } from 'pinia';
import { ref, watch } from 'vue';
import { useTheme } from 'vuetify';

const { theme: themeStore } = storeToRefs(useThemeStore())
const { setDark, setLight } = useThemeStore()
const themeGlobal = useTheme()

const theme = ref(themeStore)

watch(theme, () => {
    theme.value ? setDark() : setLight()
}, { immediate: true })
</script>

<style lang="sass" scoped>
.theme-switch
    display: flex
    align-items: center
    gap: 5px
</style>
