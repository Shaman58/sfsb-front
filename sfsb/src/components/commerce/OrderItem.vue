<template lang="pug">
    .order-item
        .order-item__indicators
            v-icon(:color="isComputed?'green':'grey'") mdi-alarm-panel-outline
            v-icon(:color="isMaterial?'green':'grey'") mdi-flask-empty
        .order-item__name
            span {{ item.technology.drawingName}}
            span {{item.technology.drawingNumber}}
</template>
<script setup lang="ts">

import {computed, toRefs} from "vue";

const props = defineProps<{ item: Item }>()
const {item} = toRefs(props)

const isComputed = computed(() => !!item.value?.technology?.computed)
const isMaterial = computed(() => !!item.value?.customerMaterial || !!item.value?.technology?.assembly || !!item.value.technology?.workpiece?.material?.price?.amount)

</script>
<style scoped lang="sass">
.order-item
    display: flex
    align-items: center
    gap: .5rem

    &__name
        display: flex
        gap: .5rem
</style>
