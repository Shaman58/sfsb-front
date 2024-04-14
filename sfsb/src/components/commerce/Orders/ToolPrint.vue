<template lang="pug" src="./ToolPrint.pug"></template>

<script setup lang="ts">

import {useRoute} from "vue-router";
import {useOrdersStore} from "@/pinia-store/orders";
import {computed, ref, watch, watchEffect} from "vue";
import ToolPrint from "@/components/commerce/Orders/ToolPrint.vue";
import router from "@/router";

const route = useRoute()
const {getToolPrint} = useOrdersStore()
const toolPrint = ref<ToolPrint | null>(null);
const totalAmount = computed(() => {
    return toolPrint.value && toolPrint.value.tools.reduce((acc, cur) => acc += cur.amount, 0) || 0
})
const totalPrice = computed(() => {
    return toolPrint.value && toolPrint.value.tools.reduce((acc, cur) => acc += cur.itemPrice, 0) || 0
})

const close = () => {
    router.back()
}

const print = window.print

watch([toolPrint], () => setTimeout(print, 1000))

watchEffect(async () => {
    const res = await getToolPrint(+route.params.id, +route.params.company);
    toolPrint.value = res || null
})
</script>


<style scoped lang="sass">
@import "./ToolPrint"
</style>
