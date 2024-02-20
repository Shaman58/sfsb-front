<template lang="pug">
    .order-card__items
        v-list.order-card__items-list
            v-list-item(@click="addNewItem" :disabled="!canAddNewItem") Добавить новую позицию
            v-list-item(v-for="(i,index) in items" @click="currentItem = i" :key="index"
                :active="isActive(i)")
                OrderItem(:item="i" @remove="removeItem(i)")
        OrderItemDetails(v-model:item="currentItem")

</template>
<script setup lang="ts">

import OrderItem from "@/components/commerce/Orders/OrderItem.vue";
import {useValidationRules} from "@/mixins/FieldValidationRules";
import {onUnmounted, ref, toRefs, watch} from "vue";
import emptyItem from "@/components/commerce/Orders/EmptyItem";
import OrderItemDetails from "@/components/commerce/Orders/OrderItemDetails.vue";

const props = defineProps<{ items: Item[] }>()
const {items} = toRefs(props)

const currentItem = ref<Item>(items.value[0])
const newItem = ref<Item | null>(null)
const canAddNewItem = ref(true)

const isActive = (item: Item): boolean => {
    const currentIndex = `${currentItem.value.id}${currentItem.value.uid}`
    const itemIndex = `${item.id}${item.uid}`
    return currentIndex === itemIndex
}

const addNewItem = () => {
    newItem.value = emptyItem()
    newItem.value.uid = Date.now().toString(36)
    items.value.push(newItem.value)
    currentItem.value = newItem.value
    canAddNewItem.value = false
}
const removeItem = (item: Item) => {
    const index = items.value.indexOf(item)
    index >= 0 && items.value.splice(index, 1)
}

const unwatchNewItem = watch([newItem], () => {
    if (!newItem.value) return
    if (newItem.value.technology.drawingNumber && newItem.value.technology.drawingNumber && newItem.value.quantity) {
        canAddNewItem.value = true
    }
}, {deep: true})

const unwatchItems=watch(items, () => {
    currentItem.value = items.value[0]
})

onUnmounted(() => {
    unwatchNewItem()
    unwatchItems()
})
</script>


<style scoped lang="sass">

</style>
