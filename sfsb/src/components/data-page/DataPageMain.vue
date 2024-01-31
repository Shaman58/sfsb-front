<template lang="pug">
    .datapage-main
        h1.datapage-main__title {{ currentTab?.name }}
        .datapage-main__container
            v-text-field.datapage-main__list-filter(label="фильтр" v-model="filterText")
            data-page-list.datapage-main__list(:list="selectedList" @select="setCurrentTool" @intersected="onIntersect")
            .datapage-main__card
                v-card.datapage-main__card-content
                    component(:is="selectedComponent" :item="currentTool" @save="save")
</template>
<script setup lang="ts">
import {useRoute} from "vue-router";
import {computed, ref, watch} from "vue";
import DataPageList from "@/components/data-page/DataPageList.vue";
import MaterialComponent from "@/components/data-page/MaterialComponent.vue";
import ToolComponent from "@/components/data-page/ToolComponent.vue";
import {useCurrentTool, useSwitches} from "@/pinia-store/tools";
import debounce from "@/mixins/Debounce";
import {storeToRefs} from "pinia";


const switches = useSwitches()

const {currentTool: currentTab} = storeToRefs(useCurrentTool())


const route = useRoute()
const filterText = ref("")

!currentTab.value?.list.length && await currentTab.value?.fetch()

const currentTool = ref(currentTab.value?.list[0])


const selectedList = computed(() => {
    return currentTab.value?.type === 'Material' ? currentTab.value?.list as Material[] : currentTab.value?.list as Tool[]
})
const selectedComponent = computed(() => currentTab.value?.type === 'Material' ? MaterialComponent : ToolComponent)
const setCurrentTool = (item: Material | Tool) => {
    if (!item) return
    const found = currentTab.value?.list.find(e => e.id === item.id)
    found && (currentTool.value = found)
}
const save = async (ev: Material | Tool) => {
    await currentTab.value?.save(ev)
    const last = document.querySelector(".v-list > .v-list-item[data-last='true']")
    last?.scrollIntoView()
    currentTool.value = selectedList.value.at(-1) || currentTab.value?.list.at(-1)
}

const onIntersect = (e: boolean) => {
    e && currentTab.value?.newData()
}


const backgroundLoadingLists = () => {
    switches.value.forEach(e => {
        if (e.list.length) return
        setTimeout(async () => await e.fetch())
    })
}
backgroundLoadingLists()

watch([route], async () => {
    filterText.value = ""
    !currentTab.value?.list.length && await currentTab.value?.fetch()
})
watch([currentTab], async () => {
    currentTool.value = currentTab.value?.list[0]
    console.log("currentTab", currentTab.value)
})

watch([filterText], debounce(async () =>
        await currentTab.value?.setFilter(filterText.value)
    , 250))
</script>


<style scoped lang="sass">
.datapage-main
    padding-inline: 1rem
    height: calc(100% - 2rem)
    display: grid
    grid-template-rows: 50px 1fr

    &__title
        margin-bottom: 1rem

    &__container
        display: grid
        grid-template-columns: 1fr 3fr
        grid-template-rows: 56px auto
        grid-template-areas: "filter card" "list card"
        gap: 0.5rem
        height: 100%
        overflow-y: hidden

    &__list-container
        height: 100%
        display: grid
        grid-template-rows: 56px 1fr
        gap: 0.2rem

    &__filter
        grid-area: filter

    &__list
        grid-area: list
        height: 100%
        overflow-y: auto
        border-radius: 4px

        &::-webkit-scrollbar
            width: 4px
            background-color: transparent

        &::-webkit-scrollbar-thumb
            width: 4px
            background-color: #777
            border-radius: 8px

    &__card
        grid-area: card

    &__card-content
        height: 100%
</style>
