<template lang="pug">
    v-card.technology-self
        v-progress-linear(v-if="loading" indeterminate color="#2F477E")
        v-card-title У меня в работе
        v-list.technology-self__list
            v-list-item(v-for="i in items||[]" :key="i.id" @click="emit('select',i)")
                span {{ i.technology.drawingNumber }} {{ i.technology.drawingName }}
</template>
<script setup lang="ts">
import {storeToRefs} from "pinia";
import {useItemStore} from "@/pinia-store/item";

const emit = defineEmits(["select"])

const {items, loading} = storeToRefs(useItemStore())
const {fetchItems} = useItemStore()
!items.value.length && await fetchItems()
</script>


<style scoped lang="sass">
.technology-self
    height: 100%

    &__list
        height: 100%
        overflow: auto

        &::-webkit-scrollbar
            width: 4px
            background-color: transparent

        &::-webkit-scrollbar-thumb
            width: 4px
            background-color: var(--scroll-color)
            border-radius: 8px
</style>
