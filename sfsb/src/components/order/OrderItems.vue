<template lang="pug">
v-card.order-items
    v-card-text
        v-list.order-items__list
            v-list-item.order-items__item(v-for="i in itemsList" :key="complexId(i)")
                item-card1(:item="i" @remove="removeItem(i)" @save="changeItem")
            v-list-item.order-items__item(:key="'new'")
                item-card1(:item="newItem()" :type="'new'" @remove="removeItem(i)" @save="addItem")

</template>

<script setup lang="ts">

import {onMounted, reactive, ref} from "vue";
import ItemCard1 from "@/components/order/itemCard1.vue";

interface Props{
    order: Order,
}
const {order} = defineProps<Props>()
let itemsList = reactive([...order.items])

let lastId = ref(0)

const newItem = ()=> {
    lastId.value++
    return ({ technology: { outsourcedCosts: { amount: 0, currency: 'RUB' }}, customerMaterial:false, uid: lastId.value } as Item)
}

const complexId = (item: Item) => item.id+"-"+item.uid
const removeItem = (item: Item) => {
    itemsList = reactive(itemsList.filter(e=>complexId(e) !== complexId(item)))
}
const addItem = (item: Item) =>{
    console.log(item)
    itemsList.push(item)
}
const changeItem = (item: Item)=>{
    const itemIndex = itemsList.findIndex(e=>complexId(e)===complexId(item))
    itemsList.splice(itemIndex,1,item)
}
onMounted(()=>{
    lastId.value = itemsList.reduce((acc,e)=>e.id > acc ? e.id : acc,0)
})
</script>


<style scoped lang="sass">
.order-items
    width: 100%
    margin-bottom: 1rem
</style>
