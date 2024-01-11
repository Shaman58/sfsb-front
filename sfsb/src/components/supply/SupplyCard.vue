<template lang="pug">
v-card.supply-card
    template(#title)
        .supply-card__title
            span {{ title }}
            v-autocomplete(label="Вид" :items="geometries" v-model="selectedType" )
            v-text-field(v-model="filterText" label="Найти материал")
    v-list.supply-card__list
        v-list-item.supply-card__item(v-for="material in filteredList" @click="$emit('select',material)" :key="material.id")
            span {{geometryByLabel(material.geometry)}} {{ material.materialName }} {{ material.gost1 || "" }} {{ material.gost2 || "" }}
            .supply-card__dates
                span обновлен: {{ material.updated }}
</template>

<script setup lang="ts">
import {useSupplyStore} from "@/pinia-store/supply";
import {storeToRefs} from "pinia";
import {ref, computed} from "vue"
import type {Ref, ComputedRef} from "vue"
import CONST from "@/consts"

interface Props {
    title: string
    materials: string
    getData: () => Promise<void>
}

const {materials, getData, title = ""} = defineProps<Props>()
const emit = defineEmits(["select"])
const filterText = ref("")
const geometries = CONST.GEOMETRIES
const selectedType: Ref<string | null> = ref(null)


console.log("SupplyCard title", title, materials)
const supplyStore = storeToRefs(useSupplyStore())

await getData()

const materialList = supplyStore[materials as keyof typeof supplyStore]

const filteredList: ComputedRef<Material[]> = computed(() => materialList.value.filter(e =>
    `${e.materialName} ${e.gost1} ${e.gost2}`
        .toLowerCase()
        .includes(filterText.value.toLowerCase()))
    .filter(e => {
        const label = geometries.find(v => v.title === selectedType.value)?.label || null
        return selectedType.value ? e.geometry === label : true
    }))

const geometryByLabel = (material: string ) => {
    const geometry = CONST.GEOMETRIES.find(e => e.label === material)
    return geometry && geometry.title
}
</script>

<style lang="sass" scoped>
.supply-card
    &__title
        display: flex
        align-items: center
        justify-content: space-between
        gap: 1rem

    &__dates
        display: flex
        align-items: center
        gap: 1rem
        font-size: 0.9em
        color: #777

    &__list
        max-height: 200px
        overflow-y: auto
        padding-bottom: 48px
</style>
