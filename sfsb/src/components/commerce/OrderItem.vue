<template lang="pug">
    .order-item
        .order-item__indicators
            v-icon(:color="isComputed?'green':'grey'") mdi-alarm-panel-outline
            v-icon(:color="isMaterial?'green':'grey'") mdi-flask-empty
        .order-item__name
            span {{ item.technology.drawingName}}
            span {{item.technology.drawingNumber}}
        .order-item__amount
            span {{item.quantity}}
        .order-item__controls
            v-icon(color="orange" @click="emit('remove')") mdi-close
</template>
<script setup lang="ts">

import {computed, toRefs} from "vue"

const props = defineProps<{ item: Item }>()
const {item} = toRefs(props)
const emit = defineEmits(["remove"])

const isComputed = computed(() => !!item.value?.technology?.computed)
const isMaterial = computed(() => !!item.value?.customerMaterial || !!item.value?.technology?.assembly || !!item.value.technology?.workpiece?.material?.price?.amount)

</script>
<style scoped lang="sass">
.order-item
    display: grid
    grid-template-columns: 60px minmax(100px, 2fr) 1fr auto
    align-items: center
    gap: .5rem

    &__name
        display: flex
        gap: .5rem

    &__controls
        margin-left: auto
</style>
