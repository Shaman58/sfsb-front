<template lang="pug">
    .list-technologies
        ul.list-technologies__content
            li.list-technologies__item(
                v-for="(i, index) in technologies"
                :key="i.id"
                @mousedown="emit('select',i)"
                :class="i.drawingNumber.includes( props.currentTechnology)?'active':'passive'"
                :ref="el => el && (elements[index] = el)"
            ) {{i.drawingNumber}} {{i.drawingName}}
</template>
<script setup lang="ts">
import {storeToRefs} from "pinia";
import useTechnologies from "@/pinia-store/technologies";
import { onBeforeMount, onBeforeUpdate, ref, watch} from "vue";

const props = defineProps<{ currentTechnology: string }>()
const emit = defineEmits<{
    (e: 'select', technology: Technology): void
}>()

const elements = ref<HTMLInputElement[]>([])

const {technologies} = storeToRefs(useTechnologies())
const {fetch} = useTechnologies()

// const filteredTechnologies = computed<Technology[]>(()=> {
//     const res = technologies.value.filter(e => e.drawingNumber.includes( props.currentTechology))
//     if(!res.length) return technologies.value
//     return res
// })


watch([props], () => {
    if (!technologies.value || !technologies.value.length) return
    const indexElement = technologies.value.find(e => e.drawingNumber.includes(props.currentTechnology))
    const index = !!indexElement ? technologies.value.indexOf(indexElement) : 0
    const matchedElement = elements.value[index]
    matchedElement && matchedElement.scrollIntoView({behavior:"smooth",block:"center"})
    console.log(index, matchedElement);

}, {immediate: true, deep: true})

onBeforeUpdate(() => {
    elements.value = []
})
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
        z-index: -1
        top: 50%
        left: -2px
        translate: -50% -50%
        rotate: -45deg


    &__content
        padding: 4px
        width: 98%
        height: 98%
        margin: auto
        overflow-y: auto
        background-color: rgba(var(--v-theme-background))



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
        min-height: 30px
        display: grid
        place-items: center start

        &.active
            background-color:   rgba(var(--v-theme-surface))

</style>
