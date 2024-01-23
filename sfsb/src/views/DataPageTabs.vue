<template lang="pug">
    .datapage-tabs
        .datapage-tabs__container
            .datapage-tabs__switches
                v-btn(variant="tonal" v-for="key in switches" :key="key.id" @click="switchTab(key)") {{ key.name }}
            v-card.datapage-tabs__main
                v-card.datapage-tabs__list-container
                    v-card-title
                        v-text-field(label="фильтр")
                    v-card-text
                        v-list.datapage-tabs__list
                            v-list-item.datapage-tabs__list-item(v-for="item in normalizedList" :key="item.id" @click="setCurrentTool(item)")
                                .datapage-tabs__list-name {{ item.name }}
                                .datapage-tabs__list-options
                                    .datapage-tabs__list-option(v-if="item.gost1") {{ item.gost1}}
                                    .datapage-tabs__list-option(v-if="item.gost2") {{ item.gost2}}
                                    .datapage-tabs__list-option(v-if="item.description") {{ item.description}}
                .datapage-tabs__card
                    .datapage-tabs__card-content(v-if="currentTab?.type==='Material'")
                        | MATERIAL
                        | {{ isReactive(currentTool) ? "REACTIVE" : "NOT REACTIVE" }}
                        MaterialComponent(:material="currentTool" )
                    .datapage-tabs__card-content(v-if="currentTab?.type==='Tool'")
                        //ToolComponent(:tool="currentTool" )
                        | TOOL
</template>

<script setup lang="ts">

import {computed, isReactive, onMounted, type Ref, ref, toRef, toValue} from "vue";
import {storeToRefs} from "pinia";
import {useMaterialsStore} from "@/pinia-store/materials";
import {useToolingStore} from "@/pinia-store/tooling";
import {useCuttersStore} from "@/pinia-store/cutters";
import {useSpecialStore} from "@/pinia-store/specials";
import MaterialComponent from "@/components/data-page/Material.vue";

type MaterialOrTool = Material | Tool

interface SwitchTab {
    id: number
    name: string,
    list: Ref<Material[]> | Ref<Tool[]>
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


const switches: Readonly<SwitchTab[]> = [
    {id: 1, name: "Материалы", list: materials, type: "Material"},
    {id: 2, name: "Инструменты", list: cutters, type: "Tool"},
    {id: 3, name: "Специнструменты", list: specials, type: "Tool"},
    {id: 4, name: "Остастка", list: toolings, type: "Tool"},
] as const

const currentTab = toRef(switches[0])
const currentTool: Ref<Material> | Ref<Tool> = ref(toValue(currentTab.value.list).at(0) as Material)
const list = ref([])

const normalizedList = computed(() => toValue(currentTab.value.list).map((e: Material | Tool) => {
    if ("materialName" in e) {
        const {materialName, ...other} = e
        return {...other, name: e.materialName}
    }
    if ("toolName" in e) {
        const {toolName, ...other} = e
        return {...other, name: e.toolName}
    }
}))

const switchTab = (item: SwitchTab) => {
    currentTab.value = toValue(item)
    currentTool.value = normalizedList.value.at(0)
}

const setCurrentTool = (item: typeof normalizedList.value[0]) => {
    if (!item) return
    currentTool.value = currentTab.value.list.find(e => e.id === item.id)
}

onMounted(async () => {
    !materials.value.length && await fetchMaterials()
    !toolings.value.length && await fetchToolings()
    !cutters.value.length && await fetchCutters()
    !specials.value.length && await fetchSpecials()

    currentTool.value = toValue(currentTab.value.list).at(0) as Material
})
</script>


<style scoped lang="sass">
.datapage-tabs
    --top: 40px
    margin-top: var(--top)
    height: calc(min(100%, 100dvh) - var(--top))

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
        height: 100%
        margin-top: 1rem
        display: grid
        grid-template-columns: 1fr 4fr
        gap: .5rem

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


</style>
