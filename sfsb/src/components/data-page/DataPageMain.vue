<template lang="pug">
    .datapage-main
        h1.datapage-main__title {{ currentTab?.name }}
        .datapage-main__container
            v-text-field.datapage-main__list-filter(label="фильтр" v-model="filterText" )
            DataPageList.datapage-main__list(:list="selectedList" @select="setCurrentTool")
            .datapage-main__card
                v-card.datapage-main__card-content
                    component(:is="selectedComponent" :item="currentTool" @save="save")
</template>
<script setup lang="ts">
import {useRoute} from "vue-router";
import {storeToRefs} from "pinia";
import {useCuttersStore, useMaterialsStore, useSpecialStore, useToolingStore} from "@/pinia-store/tools";
import {computed, ref, type Ref, watch} from "vue";
import DataPageList from "@/components/data-page/DataPageList.vue";
import MaterialComponent from "@/components/data-page/MaterialComponent.vue";
import ToolComponent from "@/components/data-page/ToolComponent.vue";

interface SwitchTab {
    id: number;
    path: string;
    name: string;
    list: Material[] | Tool[];
    type: "Tool" | "Material";
    save: (item: any) => Promise<void>;
    newData: () => Promise<void>;
}

type MaterialAndTool = Partial<Material> & Partial<Tool>

const route = useRoute()
const filterText = ref("")

const isMaterial = (tool: any): tool is Material => "materialName" in tool
const isTool = (tool: any): tool is Tool => "toolName" in tool

const {tools: materials} = storeToRefs(useMaterialsStore())
const {tools: toolings} = storeToRefs(useToolingStore())
const {tools: cutters} = storeToRefs(useCuttersStore())
const {tools: specials} = storeToRefs(useSpecialStore())

const {fetchTool: fetchMaterials, saveTool: saveMaterial, newData: newDataMaterials} = useMaterialsStore()
const {fetchTool: fetchToolings, saveTool: saveToolings, newData: newDataToolings} = useToolingStore()
const {fetchTool: fetchCutters, saveTool: saveCutter, newData: newDataCutters} = useCuttersStore()
const {fetchTool: fetchSpecials, saveTool: saveSpecial, newData: newDataSpecials} = useSpecialStore()

!materials.value.length && await fetchMaterials()
!toolings.value.length && await fetchToolings()
!cutters.value.length && await fetchCutters()
!specials.value.length && await fetchSpecials()


const switches: Ref<SwitchTab[]> = computed(() => [
    {
        id: 1,
        path: "/data/materials",
        name: "Материалы",
        list: materials.value,
        type: "Material",
        save: saveMaterial,
        newData: newDataMaterials
    },
    {
        id: 2,
        path: "/data/cutters",
        name: "Инструменты",
        list: cutters.value,
        type: "Tool",
        save: saveCutter,
        newData: newDataCutters
    },
    {
        id: 3,
        path: "/data/specials",
        name: "Специнструменты",
        list: specials.value,
        type: "Tool",
        save: saveSpecial,
        newData: newDataSpecials
    },
    {
        id: 4,
        path: "/data/toolings",
        name: "Остастка",
        list: toolings.value,
        type: "Tool",
        save: saveToolings,
        newData: newDataToolings
    },
])

const currentTab = computed(() => switches.value.find(e => e.path === route.path) || switches.value[0])
const currentTool = ref(currentTab.value.list[0])


const filteredMaterialList = computed(() => {
    if (!filterText.value) return currentTab.value.list as Material[]
    return materials.value.filter(e => `${e.materialName.toLowerCase()} ${e?.gost1?.toLowerCase() || ""} ${e?.gost2?.toLowerCase() || ""}`.includes(filterText.value.toLowerCase()))
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


watch([route], () => {
    console.log("route", route.path)
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
