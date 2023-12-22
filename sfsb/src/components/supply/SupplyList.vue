<template lang="pug">
v-container
    v-card.supply
        v-card-title.supply__title SUPPLY
        v-card.supply__main
            v-card(title="Без цены:").supply__nocost
                v-list.supply__list
                    v-list-item(v-for="material in materialsNoCost" @click="selectMaterial(material)" :key="material.id")
                        span {{ material.materialName }}
                        .supply__dates
                            span создан: {{ material.created }}
                            span обновлен: {{ material.updated }}
            v-card(title="Просроченные:").supply__dataexpired
                v-list.supply__list
                    v-list-item(v-for="material in materialsDateExpired" @click="selectMaterial(material)"  :key="material.id")
                        span {{ material.materialName }}
                        .supply__dates
                            span создан: {{ material.created }}
                            span обновлен: {{ material.updated }}
            v-card(title="Все:").supply__alllist
                v-list.supply__list
                    v-list-item(v-for="material in materialsAll" @click="selectMaterial(material)"  :key="material.id")
                        span {{ material.materialName }}
                        .supply__dates
                            span создан: {{ material.created }}
                            span обновлен: {{ material.updated }}
        v-dialog(v-model="selectedMaterial")
            material-create(:material="selectedMaterial" :visible="true" :templates="[]" @hide="selectMaterial(null)" @save="save($event)")

</template>

<script setup lang="ts">
import { ref } from 'vue';
import { storeToRefs } from 'pinia'
import { useSupplyStore } from '@/pinia-store/supply'
import MaterialCreate from '@/components/material/materialCreate.vue'

const { materialsAll, materialsDateExpired, materialsNoCost } = storeToRefs(useSupplyStore())
const { getMaterialsAll, getMaterialsDateExpired, getMaterialsNoCost, saveMaterial } = useSupplyStore()

await getMaterialsAll();
await getMaterialsDateExpired();
await getMaterialsNoCost();

const selectedMaterial = ref<Material | null>(null)

const selectMaterial = (material: Material) => {
    if (!material) return selectedMaterial.value = null
    selectedMaterial.value = material
}

const save = async (material: Material) => {
    await saveMaterial(material)
}

</script>

<style lang="sass" scoped>
.supply
    &__main
        max-height: 75vh
        display: grid
        grid-template-columns: repeat(2, 1fr)
        grid-template-rows: repeat(2, calc(50% - 1rem))
        grid-template-areas: "no-cost data-expired" "all-list all-list"
        grid-gap: 1rem

    &__nocost
        grid-area: no-cost

    &__dataexpired
        grid-area: data-expired

    &__alllist
        grid-area: all-list

    &__dates
        display: flex
        align-items: center
        gap: 1rem
        font-size: 0.9em
        color: #777

    &__list
        max-height: 100%
        overflow-y: auto


</style>
