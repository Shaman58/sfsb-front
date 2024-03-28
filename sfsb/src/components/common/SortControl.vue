<template lang="pug">
    v-btn-toggle(v-model="asc")
        v-btn(:value="true" )
            v-icon mdi-sort-ascending
        v-btn(:value="false" )
            v-icon mdi-sort-descending
        v-select(
            v-model="criterion"
            :item-value="itemValue"
            :item-title="itemTitle"
            :items="items"
        )
</template>

<script setup lang="ts">
import {toRefs} from "vue";


interface Props<T> {
    itemValue: keyof T,
    itemTitle: keyof T,
    items: T[]
}

const asc = defineModel("asc")
const criterion = defineModel("criterion")
const props = defineProps<Props<Record<string, unknown>>>()
const {itemValue, itemTitle, items} = toRefs(props)
</script>

<style scoped lang="sass">

</style>
