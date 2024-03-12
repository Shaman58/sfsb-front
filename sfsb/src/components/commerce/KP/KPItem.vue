<template lang="pug">
    tr
        td
            .controls
                v-icon(icon="mdi:mdi-close" :color="'red'")
                v-icon(icon="mdi:mdi-pen" )
                v-icon(icon="mdi:mdi-plus" @click="emit('append',item)")
        td
            select(v-model="select")
                option(value="")
                option(v-for="i in technologies" :key="i.id" :value="i.drawingName+' '+i.drawingNumber") {{i.drawingName}} {{i.drawingNumber}}
            input(v-model="item.decimal")
        td {{item.name}}
        td {{new Date(item.created).toLocaleDateString()}}
        td {{new Date(item.updated).toLocaleDateString()}}
        td
            input(ref="refItemPrice" v-model="item.itemPrice" @focus="focusPrice" @blur="blurPrice")
        td
            input(v-model="item.amount")
        td {{item.totalPrice}}
</template>

<script setup lang="ts">
import {storeToRefs} from "pinia";
import useTechnologies from "@/pinia-store/technologies";
import {onBeforeMount, onUnmounted, ref, watch} from "vue";
import KPItem from "@/components/commerce/KP/KPItem.vue";

const item = defineModel<KPItem>("item", {required: true})
const emit = defineEmits(["append"])



const select = ref("")

const {technologies} = storeToRefs(useTechnologies())
const {fetch} = useTechnologies()

const refItemPrice = ref<HTMLInputElement|null>(null)

const focusPrice=()=>{
    const price = item.value.itemPrice.replace(/^RUB /,"")
    refItemPrice.value && (refItemPrice.value.type="number")
    item.value.itemPrice=price
}

const blurPrice=()=>{
    refItemPrice.value && (refItemPrice.value.type="text")
    item.value.itemPrice="RUB "+item.value.itemPrice
    const [currency] = item.value.totalPrice.split(" ")
    const [_,value] = item.value.itemPrice.split(" ")
    item.value.totalPrice = currency+" "+ (+value * item.value.amount).toFixed(2)
}


watch([select],()=>{
    item.value.decimal = select.value
})


onBeforeMount(async () => {
    !technologies.value.length && await fetch()
})

onUnmounted(()=>{
    unwatchItemPrice()
})
</script>

<style scoped lang="sass">

</style>
