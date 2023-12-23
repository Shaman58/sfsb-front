<template lang="pug">
v-container
    v-card.supply
        v-card-title.supply__title SUPPLY
        v-card.supply__main
            SupplyCard.supply__nocost(title="Без цены: " :materialList="materialsNoCost" @select="selectMaterial($event)")
            SupplyCard.supply__dataexpired(title="Просроченные: " :materialList="materialsDateExpired" @select="selectMaterial($event)")
            SupplyCard.supply__alllist(title="Все: " :materialList="materialsAll" @select="selectMaterial($event)")

        v-dialog(v-model="selectedMaterial")
            MaterialCreate(:material="selectedMaterial" :visible="true" :templates="[]" @hide="selectMaterial(null)" @save="save($event)")

</template>

<script setup lang="ts">
import { ref } from 'vue';
import { storeToRefs } from 'pinia'
import { useSupplyStore } from '@/pinia-store/supply'
import SupplyCard from "./SupplyCard.vue"
import MaterialCreate from "@/components/material/MaterialCreate.vue"
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
</style>
