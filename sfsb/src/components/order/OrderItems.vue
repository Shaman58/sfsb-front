<template lang="pug">
v-card.order-items
    v-card-text
        v-list.order-items__list
            v-list-item.order-items__item(v-for="i in itemsList" :key="complexId(i)")
                item-card1(:item="i" @remove="removeItem(i)")


</template>

<script setup lang="ts">

import {reactive, ref} from "vue";
import ItemCard1 from "@/components/order/itemCard1.vue";

interface Props{
    order: Order,
}
const {order} = defineProps<Props>()
let itemsList = reactive([...order.items])

const complexId = (item: Item) => item.id+"-"+item.uid
const removeItem = (item: Item) => {
    itemsList = reactive(itemsList.filter(e=>complexId(e) !== complexId(item)))
}
</script>


<style scoped lang="sass">

</style>
