<template lang="pug">
    v-container
        v-card.supply
            v-card-title.supply__title СНАБЖЕНИЕ
            v-card.supply__main
                Suspense
                    template(v-slot:fallback)
                        div.supply__loader
                    SupplyCard.supply__nocost(title="Без цены: " :materials="'materialsNoCost'" @select="selectMaterial($event)" :getData="getMaterialsNoCost")
                Suspense
                    template(v-slot:fallback)
                        div.supply__loader
                    SupplyCard.supply__dataexpired(title="Просроченные: " :materials="'materialsDateExpired'" @select="selectMaterial($event)" :getData="getMaterialsDateExpired")
                Suspense
                    template(v-slot:fallback)
                        div.supply__loader
                    SupplyCard.supply__alllist(title="Все: " :materials="'materialsAll'" @select="selectMaterial($event)" :getData="getMaterialsAll")

            v-dialog(v-model="wasSelectedMaterial")
                MaterialCreate(:material="selectedMaterial" :visible="true" :templates="[]" @hide="selectMaterial(null)" @save="save($event)")

</template>

<script setup lang="ts">
import {computed, ref} from 'vue';
import {useSupplyStore} from '@/pinia-store/supply'
import SupplyCard from "./SupplyCard.vue"
import MaterialCreate from "@/components/material/MaterialCreate.vue"

const {getMaterialsAll, getMaterialsDateExpired, getMaterialsNoCost, saveMaterial} = useSupplyStore()


const selectedMaterial = ref<Material | null>(null)
const wasSelectedMaterial = computed(() => !!selectedMaterial.value)

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

    &__loader
        --x: 0%
        width: 100%
        height: 30vh
        border-radius: 10px
        background: linear-gradient(45deg, #7777 0% var(--x), #9997 var(--x) calc(var(--x) + 2%), #7777 calc(var(--x) + 2%) 100%)
        animation: anim 1s infinite ease-in-out

    @keyframes anim
        0%
            --x: 0%
        50%
            --x: 100%
        100%
            --x: 0%

</style>
