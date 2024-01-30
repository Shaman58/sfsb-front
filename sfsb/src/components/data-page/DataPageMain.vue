<template lang="pug">
    .datapage-main
        h1.datapage-main__title {{ currentTab?.name }}
        .datapage-main__container
            v-text-field.datapage-main__list-filter(label="фильтр" v-model="filterText" )
            DataPageList.datapage-main__list(:list="selectedList" @select="setCurrentTool" @intersected="onIntersect")
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
import {useCuttersStore, useMaterialsStore, useSpecialStore, useToolingStore} from "@/pinia-store/tools";
import useSwitches from "@/mixins/SwitchesDataPge";

const switches = useSwitches(useCuttersStore, useMaterialsStore, useSpecialStore, useToolingStore)

type MaterialAndTool = Partial<Material> & Partial<Tool>

const route = useRoute()
const filterText = ref("")

const isMaterial = (tool: any): tool is Material => "materialName" in tool
const isTool = (tool: any): tool is Tool => "toolName" in tool

const currentTab = computed(() => switches.value.find(e => e.path === route.path) || switches.value[0])
!currentTab.value.list.length && await currentTab.value.fetch()

const currentTool = ref(currentTab.value.list[0])


const filteredMaterialList = computed(() => {
    if (!filterText.value) return currentTab.value.list as Material[]
    return (currentTab.value.list as Material[]).filter(e => `${e.materialName.toLowerCase()} ${e?.gost1?.toLowerCase() || ""} ${e?.gost2?.toLowerCase() || ""}`.includes(filterText.value.toLowerCase()))
})
const filteredToolList = computed(() => {
    if (!filterText.value) return currentTab.value.list as Tool[]
    return (currentTab.value.list as Tool[]).filter(e => `${e.toolName.toLowerCase()} ${e.description.toLowerCase()}`.includes(filterText.value.toLowerCase()))
})
const selectedList = computed(() => {
    return currentTab.value.type === 'Material' ? filteredMaterialList.value : filteredToolList.value
})
const selectedComponent = computed(() => currentTab.value.type === 'Material' ? MaterialComponent : ToolComponent)
const setCurrentTool = (item: MaterialAndTool) => {
    if (!item) return
    const found = currentTab.value.list.find(e => e.id === item.id)
    found && (currentTool.value = found)
}
const save = async (ev: Material | Tool) => {
    await currentTab.value.save(ev)
    const last = document.querySelector(".v-list > .v-list-item[data-last='true']")
    last?.scrollIntoView()
    currentTool.value = selectedList.value.at(-1) || currentTab.value.list.at(-1)
}

const onIntersect = (e: boolean) => {
    e && currentTab.value.newData()
}

watch([route], () => {
    currentTool.value = currentTab.value.list[0]
})
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
