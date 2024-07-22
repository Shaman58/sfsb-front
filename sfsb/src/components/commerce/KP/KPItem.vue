<template lang="pug">
    tr.item(v-if="item")
        td
            .controls
                v-icon(icon="mdi:mdi-close" :color="'red'" @click="emit('remove',item)")
                v-icon(icon="mdi:mdi-plus" @click="emit('append',item)")
        td.item__decimal
            input.item__decimal-input(v-model="item.decimal" ref="refDecimal")
            ListTechnologiesPopUp(:current-technology="item.decimal" @select="onSelect")
        td.item__name
            input.item__name-input(v-model="item.name" ref="refName")
        td
            input(ref="refItemPrice" step="0.01" v-model="item.itemPrice")
        td
            input(v-model="item.amount" type="number")
        td {{item.totalPrice}}
</template>

<script setup lang="ts">
import {ref, watch} from "vue";
import KPItem from "@/components/commerce/KP/KPItem.vue";
import ListTechnologiesPopUp from "@/components/commerce/KP/ListTechnologiesPopUp.vue";

const item = defineModel<KPItem>("item", {required: true,})
const emit = defineEmits(["append", "remove"])

const onSelect = (e: Technology) => {
    console.log(e)
    item.value.decimal = e.drawingNumber
    item.value.name = e.drawingName
}

const refItemPrice = ref<HTMLInputElement | null>(null)
const refDecimal = ref<HTMLInputElement | null>(null)
const refName = ref<HTMLInputElement | null>(null)

watch([item], () => {
    item.value.totalPrice = item.value.itemPrice * item.value.amount
}, {deep: true, immediate: true})
</script>

<style scoped lang="sass">
.item

    &__decimal
        position: relative
        translate: 0 0

    &__decimal-input
        &:focus + .list-technologies
            opacity: 1
            pointer-events: all


</style>
