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
                            v-list-item(v-for="item in normalizedList" :key="item.id" @click="currentTool=item") {{ item.name }}
                v-card.datapage-tabs__card
                    .datapage-tabs__card-material(v-if="currentTab.type==='Material'")
                    .datapage-tabs__card-tool(v-else)
</template>

<script setup lang="ts">

import {computed, type MaybeRef, onMounted, type Ref, ref, toValue} from "vue";
import {storeToRefs} from "pinia";
import {useMaterialsStore} from "@/pinia-store/materials";
import {useToolingStore} from "@/pinia-store/tooling";
import {useCuttersStore} from "@/pinia-store/cutters";
import {useSpecialStore} from "@/pinia-store/specials";

interface SwitchTab {
    id: number
    name: string,
    list: MaybeRef<Material[] | Tool[]>
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

onMounted(async () => {
    !materials.value.length && await fetchMaterials()
    !toolings.value.length && await fetchToolings()
    !cutters.value.length && await fetchCutters()
    !specials.value.length && await fetchSpecials()
})


const switches: Readonly<SwitchTab[]> = [
    {id: 1, name: "Материалы", list: materials, type: "Tool"},
    {id: 2, name: "Инструменты", list: cutters, type: "Tool"},
    {id: 3, name: "Специнструменты", list: specials, type: "Tool"},
    {id: 4, name: "Остастка", list: toolings, type: "Tool"},
] as const

const currentTab: Ref<SwitchTab> = ref(switches[0])
const currentTool: Ref<Material | Tool | undefined> = ref(toValue(currentTab.value.list).at(0))
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
    currentTool.value = toValue(currentTab.value.list).at(0)
}
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

</style>
