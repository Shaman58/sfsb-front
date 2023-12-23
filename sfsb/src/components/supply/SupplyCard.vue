<template lang="pug">
v-card.supply-card
    template(#title)
        .supply-card__title
            span {{ title }}
            v-text-field(v-model="filterText" label="Найти материал")
    v-list.supply-card__list
        v-list-item.supply-card__item(v-for="material in filteredList" @click="$emit('select',material)" :key="material.id")
            span {{ material.materialName }}
            .supply-card__dates
                span создан: {{ material.created }}
                span обновлен: {{ material.updated }}
</template>

<script setup lang="ts">
import { ref, computed } from "vue"
interface Props {
    title: string
    materialList: Material[]
}
const { materialList, title = "" } = defineProps<Props>()
const emit = defineEmits(["select"])
const filterText = ref("")
const filteredList = computed(() => materialList.filter(e => e.materialName.includes(filterText.value)))

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
        max-height: 100%
        overflow-y: auto
</style>
