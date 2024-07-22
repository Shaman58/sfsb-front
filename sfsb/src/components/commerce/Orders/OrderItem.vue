<template lang="pug">
    .order-item
        .order-item__indicators(@click="emit('select', item)")
            v-icon(:color="isComputed?'green':'grey'") mdi-alarm-panel-outline
            v-icon(:color="isMaterial?'green':'grey'") mdi-flask-empty
        .order-item__name(@click="emit('select', item)")
            span {{ item.technology.drawingName}}
            span {{item.technology.drawingNumber}}
        .order-item__amount(@click="emit('select', item)")
            span {{item.quantity}}
        .order-item__controls
            v-icon(color="orange" @click="emit('remove')") mdi-close
</template>
<script setup lang="ts">

import {computed, toRefs} from "vue"

const props = defineProps<{ item: Item }>()
const {item} = toRefs(props)
const emit = defineEmits(["remove", "select"])

const isComputed = computed(() => !!item.value?.technology?.computed)
const isMaterial = computed(() => !!item.value?.customerMaterial || !!item.value?.technology?.assembly || !!item.value.technology?.workpiece?.material?.price?.amount)

</script>
<style scoped lang="sass">
.order-item
    --first-column: 60px
    display: grid
    grid-template-columns: var(--first-column) minmax(100px, 1fr) 2rem auto
    align-items: center
    gap: .5rem

    @media (width < 500px)
        --first-column: 30px

    &__name
        display: flex
        flex-wrap: wrap
        gap: .5rem

        @media (width < 500px)
            font-size: clamp(11px, 16 / 500 * 100vw, 1rem)

    &__controls
        margin-left: auto

    &__amount
        @media (width < 500px)
            font-size: clamp(11px, 16 / 500 * 100vw, 1rem)
</style>
