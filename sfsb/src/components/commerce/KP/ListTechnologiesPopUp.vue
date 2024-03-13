<template lang="pug">
.list-technologies
    .list-technologies__content
        v-list
            v-list-item.list-technologies__item(v-for="i in filteredTechnologies" :key="i.id" height="20" @mousedown="emit('select',i)") {{i.drawingNumber}} {{i.drawingName}}
</template>
<script setup lang="ts">
import {storeToRefs} from "pinia";
import useTechnologies from "@/pinia-store/technologies";
import {computed, onBeforeMount, watch} from "vue";

const props = defineProps<{currentTechology: string}>()
const emit = defineEmits<{
    (e: 'select', technology: Technology): void
}>()


const {technologies} = storeToRefs(useTechnologies())
const {fetch} = useTechnologies()

const filteredTechnologies = computed<Technology[]>(()=> {
    const res = technologies.value.filter(e => e.drawingNumber.includes( props.currentTechology))
    if(!res.length) return technologies.value
    return res
})


watch([props],()=>{

},{immediate:true,deep: true})

onBeforeMount(async () => {
    !technologies.value.length && await fetch()
})
</script>
<style scoped lang="sass">
.list-technologies
    opacity: 0
    pointer-events: none
    transition: opacity .5s
    z-index: -1
    position: absolute
    top: 0
    left: 100%
    width: 200px
    height: 52px
    border-radius: 8px
    box-shadow: 0 0 12px rgba(var(--v-theme-on-surface), 50%)
    border: 3px solid rgb(var(--v-theme-on-surface))

    &::before
        content: ""
        width: 20px
        height: 20px
        border-top: 3px solid rgb(var(--v-theme-on-surface))
        border-left: 3px solid rgb(var(--v-theme-on-surface))
        background-color: rgba(var(--v-theme-surface))
        position: absolute
        z-index: 0
        top: 50%
        left: -2px
        translate: -50% -50%
        rotate: -45deg


    &__content
        width: 98%
        height: 98%
        margin: auto
        overflow-y: auto

        &::-webkit-scrollbar
            width: 8px
            background-color: transparent

        &::-webkit-scrollbar-thumb
            width: 8px
            background-color: var(--scroll-color)
            border-radius: 8px

    &__item
        cursor: pointer
        font-size: 12px

</style>
