<template lang="pug">
v-card.order-items
    v-card-text
        v-list.order-items__list
            v-list-item.order-items__item(v-for="i in itemsList" :key="complexId(i)")
                item-card1(:item="i" @save="changeItem" @remove="removeItem(i)")
            v-list-item.order-items__item(:key="'new'")
                item-card1(:item="null" :type="'new'" @save="addItem")

</template>

<script setup lang="ts">

import {isRef, ref} from "vue";
import type {Ref} from "vue"
import ItemCard1 from "@/components/order/itemCard1.vue";

interface Props{
    items: Item[],
}
const {items} = defineProps<Props>()
const emit = defineEmits(["update:items"])
let itemsList = ref([...items])

const complexId = (item: Item|Ref<Item>): string => {
    if (isRef(item))  return item.value.id + "-" + item.value.uid
    return item.id + "-" + item.uid
}
const removeItem = (item: Item) => {
    itemsList.value = itemsList.value.filter(e=>complexId(e) !== complexId(item))
    emit("update:items", itemsList.value)
}
const addItem = (item: Item) =>{
    console.log(item)
    itemsList.value.push(item)
    emit("update:items", itemsList.value)
}
const changeItem = (item: Item)=>{
    const b = complexId(item)
    const itemIndex = itemsList.value.findIndex(e=> {
        const a = complexId(e)
        return a === b
    })
    itemsList.value.splice(itemIndex,1,item)
    emit("update:items", itemsList.value)
}

</script>


<style scoped lang="sass">
.order-items
    width: 100%
    margin-bottom: 1rem
</style>
