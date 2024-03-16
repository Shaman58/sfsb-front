<template lang="pug">
    .container
        .track
            .position(@click="()=>position=0")
            .position(@click="()=>position=1")
            .position(@click="()=>position=2")
            .thumb(:data-set="position")
                v-icon( v-if="position===0" icon="mdi:mdi-white-balance-sunny" color="black")
                v-icon( v-if="position===1" icon="mdi:mdi-brightness-auto" color="#333")
                v-icon( v-if="position===2" icon="mdi:mdi-weather-night" color="white")
</template>
<script setup lang="ts">
import {computed, onBeforeMount, ref, watch} from "vue"
import {useThemeStore} from "@/pinia-store/themeSwitcher"
import {storeToRefs} from "pinia"
import useStorageTheme from "@/mixins/storageTheme";

const {theme} = storeToRefs(useThemeStore())
const {setDark, setLight} = useThemeStore()
const position = ref(0)

const {lightOn,darkOn,autoOn} = useStorageTheme()
const colorMap = ["#eee", "#aaa", "#333"]
const bgcolor = computed(() => colorMap[position.value])



watch([position], () => {
    [()=>lightOn(setLight), autoOn, ()=>darkOn(setDark)][position.value]()
}, )

onBeforeMount(() => {
    const storagedTheme = window.localStorage.getItem("theme")
    if(!storagedTheme) return position.value=1
    position.value = {"light":0,"auto":1,"dark":2}[storagedTheme] ?? 1
})
</script>


<style scoped lang="sass">
.container
    --height: 2rem
    width: 100px
    height: var(--height)

.track
    position: relative
    height: 100%
    display: grid
    grid-template-columns: repeat(3, 1fr)
    border-radius: 200px
    overflow: hidden


.position
    background: #777

.thumb
    position: absolute
    z-index: 1
    background: v-bind("bgcolor")
    height: calc(var(--height) * 0.8)
    top: 50%
    left: 1rem
    translate: 0 -50%
    aspect-ratio: 1
    border-radius: 50%
    display: grid
    place-items: center
    pointer-events: none
    transition: left .5s, translate .5s

    &[data-set="0"]
        left: calc(var(--height) / 5)
        translate: 0 -50%

    &[data-set="1"]
        left: 50%
        translate: -50% -50%

    &[data-set="2"]
        left: 100%
        translate: calc(-100% - var(--height) / 5) -50%
</style>
