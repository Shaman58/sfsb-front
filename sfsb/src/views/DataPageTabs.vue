<template lang="pug">
    .datapage-tabs
        .datapage-tabs__container
            .datapage-tabs__switches
                v-btn( v-for="key in switches" :key="key.id" @click="switchTab(key)" :variant="key.id === currentTab.id ? 'flat' : 'tonal'") {{ key.name }}
            .datapage-tabs__main
                .datapage-tabs__list-container
                    v-text-field(label="фильтр" v-model="filterText" )
                    v-list.datapage-tabs__list
                        v-list-item.datapage-tabs__list-item(
                            v-for="(item, index) in filtredList"
                            :key="item.id"
                            @click="setCurrentTool(item)"
                            :active="currentTool?.id === item.id"
                            :data-last="index === filtredList.length-1"
                            v-intersect="index === filtredList.length-1 && onIntersect"
                        )
                            .datapage-tabs__list-name {{ item.name }}
                            .datapage-tabs__list-options
                                .datapage-tabs__list-option(v-if="item.gost1") {{ item.gost1}}
                                .datapage-tabs__list-option(v-if="item.gost2") {{ item.gost2}}
                                .datapage-tabs__list-option(v-if="item.description") {{ item.description}}
                .datapage-tabs__card
                    component(:is="selectedComponent" :item="currentTool" @save="save")
</template>

<script setup lang="ts">

import {computed, type ComputedRef, onMounted, type Ref, ref, toValue, watch} from "vue";
import {storeToRefs} from "pinia";
import {useMaterialsStore} from "@/pinia-store/materials";
import {useToolingStore} from "@/pinia-store/tooling";
import {useCuttersStore} from "@/pinia-store/cutters";
import {useSpecialStore} from "@/pinia-store/specials";
import MaterialComponent from "@/components/data-page/Material.vue";
import Material from "@/components/data-page/Material.vue";
import ToolComponent from "@/components/data-page/Tool.vue";

// type CommonType = Partial<Material> & Partial<Tool>
type CommonType = {
    id: number;
    created?: string | null | unknown;
    updated?: string | null | unknown;
    toolName?: string;
    description?: string;
    materialName?: string;
    gost1?: string;
    gost2?: string | null;
    geometry?: string;
    price?: ItemPrice;
    density?: number;
    name?: string;
}

type PartialCommonType = Partial<CommonType>

interface SwitchTab {
    id: number;
    name: string;
    list: Material[] | Tool[];
    type: "Tool" | "Material";
    save: (item: any) => Promise<void>;
    newData: () => Promise<void>;
}

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
// const {tools: toolingTools} = storeToRefs(useToolingStore())
// !toolingStore.tools.length && await toolingStore.fetchTool()
!cutters.value.length && await fetchCutters()
!specials.value.length && await fetchSpecials()


const switches: Ref<SwitchTab[]> = ref([
    {id: 1, name: "Материалы", list: materials, type: "Material", save: saveMaterial, newData: newDataMaterials},
    {id: 2, name: "Инструменты", list: cutters, type: "Tool", save: saveCutter, newData: newDataCutters},
    {id: 3, name: "Специнструменты", list: specials, type: "Tool", save: saveSpecial, newData: newDataSpecials},
    {id: 4, name: "Остастка", list: toolings, type: "Tool", save: saveToolings, newData: newDataToolings},
])


const currentTab = ref<SwitchTab>(switches.value[0])
const currentTool: Ref<PartialCommonType | undefined> = ref(toValue(currentTab.value.list).at(0) as Material)
const list = ref([])
const request = ref(false)

const normalizedList: ComputedRef<(CommonType | undefined)[]> = computed(() => currentTab.value.list.map((e: CommonType) => {
    if (isMaterial(e)) {
        const {materialName, ...other} = e
        return {...other, name: e.materialName}
    }
    if (isTool(e)) {
        const {toolName, ...other} = e
        return {...other, name: e.toolName}
    }
}))

const selectedComponent = computed(() => currentTab.value.type === 'Material' ? MaterialComponent : ToolComponent)

const switchTab = (item: SwitchTab) => {
    currentTab.value = item
    currentTool.value = normalizedList.value.at(0)
}

const setCurrentTool = (item: typeof normalizedList.value[0]) => {
    if (!item) return
    const found = currentTab.value.list.find((e: CommonType) => e.id === item.id)
    found && (currentTool.value = found)
}

const filterText = ref("")
const filtredList = computed(() => {
    if (!filterText.value) return normalizedList.value
    return normalizedList.value.filter(e => {
        if (!e) return false
        const concat = `${e?.name?.toLowerCase()} ${e?.description?.toLowerCase() || ""} ${e?.gost1?.toLowerCase() || ""} ${e?.gost2?.toLowerCase() || ""}`
        return concat.includes(filterText.value.toLowerCase())
    })
})

const save = async (ev: CommonType) => {
    await currentTab.value.save(ev)
    const last = document.querySelector(".v-list > .v-list-item[data-last='true']")
    last?.scrollIntoView()
    currentTool.value = filtredList.value.at(-1)

}

const onIntersect = (e: boolean) => {
    console.log("intersect", e)
    request.value = e || request.value
}
onMounted(async () => {
    currentTool.value = toValue(currentTab.value.list).at(0) as Material
})

watch([currentTab], () => {
    currentTool.value = currentTab.value.list[0]
})

watch([request], async () => {
    console.log("watch", request.value)
    request.value && await currentTab.value.newData()
    request.value = false
})


//TODO: вынести list в отдельный компонент
</script>


<style scoped lang="sass">
.fade-enter-active, .fade-leave-active
    transition: opacity .5s

.fade-enter-from, .fade-leave-to
    opacity: 0

.datapage-tabs
    --top: 10px
    margin-top: var(--top)
    padding-top: 2rem
    height: calc(100dvh - 42px)
    background-color: rgba(174, 174, 231, 0.3)

    &__container
        margin-inline: 1rem
        height: 100%

        display: grid
        grid-template-rows: 50px 1fr

    &__switches
        display: flex
        justify-content: center
        gap: 0.5rem

    &__main
        height: min(520px, 100%)
        //overflow-y: auto
        margin-top: 1rem
        display: grid
        grid-template-columns: 1fr 4fr
        gap: .5rem

    &__list-container
        display: grid
        grid-template-rows: 50px 1fr
        overflow-y: auto
        gap: 1rem

    &__list
        border-radius: 4px

        &::-webkit-scrollbar
            width: 4px
            background-color: transparent

        &::-webkit-scrollbar-thumb
            width: 4px
            background-color: #777
            border-radius: 8px

    &__list-name
        font-size: 1.1rem
        font-weight: 700

    &__list-options
        margin-top: 0.5rem
        display: flex
        gap: .5rem
        flex-wrap: wrap

    &__list-option
        font-weight: 200
        font-size: 0.9rem

    &__card
        height: 100%

    &__card-content
        height: 100%


</style>
