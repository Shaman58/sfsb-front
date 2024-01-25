<template lang="pug">
    .datapage-tabs
        .datapage-tabs__container
            .datapage-tabs__switches
                v-btn( v-for="key in switches" :key="key.id" @click="switchTab(key)" :variant="key.id === currentTab.id ? 'flat' : 'tonal'") {{ key.name }}
            .datapage-tabs__main
                .datapage-tabs__list-container
                    v-text-field(label="фильтр" v-model="filterText" )
                    v-list.datapage-tabs__list
                        v-list-item.datapage-tabs__list-item(v-for="item in filtredList" :key="item.id" @click="setCurrentTool(item)" :variant="item.id === currentTool?.id ? 'tonal' : 'flat'" )
                            .datapage-tabs__list-name {{ item.name }}
                            .datapage-tabs__list-options
                                .datapage-tabs__list-option(v-if="item.gost1") {{ item.gost1}}
                                .datapage-tabs__list-option(v-if="item.gost2") {{ item.gost2}}
                                .datapage-tabs__list-option(v-if="item.description") {{ item.description}}
                .datapage-tabs__card
                    component(:is="selectedComponent" :item="currentTool")
</template>

<script setup lang="ts">

import {computed, ComputedRef, onMounted, type Ref, ref, toValue, watch} from "vue";
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
    created?: string | null;
    updated?: string | null;
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

interface SwitchTab {
    id: number
    name: string
    list: Ref<CommonType[]>
    type: "Tool" | "Material"
}

const {materials} = storeToRefs(useMaterialsStore())
const {toolings} = storeToRefs(useToolingStore())
const {cutters} = storeToRefs(useCuttersStore())
const {specials} = storeToRefs(useSpecialStore())

const {fetchMaterials} = useMaterialsStore()
const {fetchToolings} = useToolingStore()
const {fetchCutters} = useCuttersStore()
const {fetchSpecials} = useSpecialStore()

!materials.value.length && await fetchMaterials()
!toolings.value.length && await fetchToolings()
!cutters.value.length && await fetchCutters()
!specials.value.length && await fetchSpecials()


const switches: Readonly<SwitchTab[]> = [
    {id: 1, name: "Материалы", list: materials, type: "Material"},
    {id: 2, name: "Инструменты", list: cutters, type: "Tool"},
    {id: 3, name: "Специнструменты", list: specials, type: "Tool"},
    {id: 4, name: "Остастка", list: toolings, type: "Tool"}
] as const

const currentTab: Ref<SwitchTab> = ref(switches[0])
const currentTool: Ref<CommonType | undefined> = ref(toValue(currentTab.value.list).at(0) as Material)
const list = ref([])

const normalizedList: ComputedRef<(CommonType | undefined)[]> = computed(() => toValue(currentTab.value.list).map((e: CommonType) => {
    if ("materialName" in e) {
        const {materialName, ...other} = e
        return {...other, name: e.materialName}
    }
    if ("toolName" in e) {
        const {toolName, ...other} = e
        return {...other, name: e.toolName}
    }
}))

const selectedComponent = computed(() => currentTab.value.type === 'Material' ? MaterialComponent : ToolComponent)

const switchTab = (item: SwitchTab) => {
    currentTab.value = toValue(item)
    currentTool.value = normalizedList.value.at(0)
}

const setCurrentTool = (item: typeof normalizedList.value[0]) => {
    if (!item) return
    const found = currentTab.value.list.value.find((e: CommonType) => e.id === item.id)
    found && (currentTool.value = found)
}

const filterText = ref("")
const filtredList = computed(() => {
    if (!filterText.value) return normalizedList.value
    return normalizedList.value.filter(e => {
        if (!e) return false
        const concat = `${e.name} ${e?.description || ""} ${e?.gost1 || ""} ${e?.gost2 || ""}`
        return concat.includes(filterText.value)
    })
})


onMounted(async () => {
    currentTool.value = toValue(currentTab.value.list).at(0) as Material
})

watch([currentTab], () => {
    currentTool.value = currentTab.value.list.value[0]
})
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
