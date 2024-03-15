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
        td {{new Date(item.created).toLocaleDateString()}}
        td {{new Date(item.updated).toLocaleDateString()}}
        td
            input(ref="refItemPrice" step="0.01" v-model="item.itemPrice" @focus="focusPrice" @blur="blurPrice")
        td
            input(v-model="item.amount" type="number" @change="changeAmount")
        td {{item.totalPrice}}
</template>

<script setup lang="ts">
import {ref} from "vue";
import KPItem from "@/components/commerce/KP/KPItem.vue";
import ListTechnologiesPopUp from "@/components/commerce/KP/ListTechnologiesPopUp.vue";

const item = defineModel<KPItem>("item", {required: true,})
const emit = defineEmits(["append","remove"])

const onSelect=(e: Technology)=> {
    console.log(e)
    item.value.decimal = e.drawingNumber
    item.value.name = e.drawingName
}

const refItemPrice = ref<HTMLInputElement|null>(null)
const refDecimal = ref<HTMLInputElement|null>(null)
const refName = ref<HTMLInputElement|null>(null)

const focusPrice=()=>{
    const price = item.value.itemPrice.replace(/^RUB /,"")
    refItemPrice.value && (refItemPrice.value.type="number")
    item.value.itemPrice=price
}

const recalcTotalPrice = (price: number, amount: number)=>{
    const [currency, total] = item.value.totalPrice.split(" ")
    if(!total) return item.value.totalPrice = (price * amount).toString()
    return item.value.totalPrice = currency + " " + (price * amount).toFixed(2)
}
const blurPrice=()=>{
    refItemPrice.value && (refItemPrice.value.type="text")
    recalcTotalPrice(+item.value.itemPrice, item.value.amount)
    item.value.itemPrice="RUB "+ (+item.value.itemPrice).toFixed(2)
}
const changeAmount = (e: Event)=>{
    const value =(e.target as HTMLInputElement).value
    const [currency,priceVal] = item.value.itemPrice.split(" ")
    const price = priceVal || currency
    recalcTotalPrice(+price, +value)
}


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
