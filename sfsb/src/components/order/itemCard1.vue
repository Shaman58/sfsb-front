<template lang="pug">
.item-card
    .item-card__info(v-if="!editing")
        .item-card__indicators
            v-icon mdi-alarm-panel-outline
            v-icon mdi-flask-empty
        .item-card__name {{item.technology.drawingNumber}} {{item.technology.drawingName}}
        .item-card__amount {{item.quantity}} шт.
        .item-card__controls
            v-icon(@click="editing=true") mdi-edit-note
            v-icon(@click="emit('remove')" mdi-close
    .item-card__details(v-if="editing")
        .item-card__details-date
            v-text-field.item-card__schema-number
            v-text-field.item-card__schema-name
            v-text-field.item-card__schema-amount
        .item-card__details-controls
            v-select.item-card__outsource-material
            .item-card__change
            .item-card__close(@click="editing=false") Закрыть
</template>

<script setup lang="ts">
import {ref} from "vue";

const {item} = defineProps<{item: Item}>()
const emit = defineEmits(["save", "remove"])

const editing = ref(false)
</script>

<style scoped lang="sass">

</style>
