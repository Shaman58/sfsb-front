<template lang="pug">
    v-card
        v-card-title У меня в работе
        v-list.list
            v-list-item(v-for="i in items||[]" :key="i.id" @click="emit('select',i)")
                span {{ i.technology.drawingNumber }} {{ i.technology.drawingName }}
</template>
<script setup lang="ts">
import {storeToRefs} from "pinia";
import {useItemStore} from "@/pinia-store/item";

const emit = defineEmits(["select"])

const {items} = storeToRefs(useItemStore())
const {fetchItems} = useItemStore()
!items.value.length && await fetchItems()
</script>


<style scoped lang="sass">
.list
    height: 100%
</style>
