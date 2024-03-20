<template lang="pug">
    .order-items
        v-list.order-items__items-list
            v-list-item(@click="addNewItem" :disabled="!canAddNewItem") Добавить новую позицию
            v-list-item(v-for="(i,index) in items"  :key="index"
                :active="isActive(i)")
                OrderItem(:item="i" @remove="removeItem(i)" @select="$event=>changeItem($event)")
        OrderItemDetails.order-items__desktop-details(v-model:item="currentItem" :save="canSave")

    v-dialog.order-items__mobile-details(v-model="showDialog" v-if="screenWidth < 1024")
        v-container
            v-card.order-items__mobile-card
                v-card-title {{ number }} {{customer}}
                OrderItemDetails(v-model:item="currentItem" :save="canSave" ref="validForm")
                v-card-actions
                    v-btn(color="primary" @click="showDialog=false") Закрыть
                    v-btn(color="primary" @click="toSave" :disabled="!canAddNewItem || !validForm?.valid") Сохранить
</template>
<script setup lang="ts">

import OrderItem from "@/components/commerce/Orders/OrderItem.vue";
import {onUnmounted, ref, toRefs, watch} from "vue";
import OrderItemDetails from "@/components/commerce/Orders/OrderItemDetails.vue";
import {Empty} from "@/mixins/Empty";
import {useDisplay} from "vuetify";

const {width: screenWidth} = useDisplay()
const props = defineProps<{ items: Item[], customer: string, number: number }>()
const {items, customer, number} = toRefs(props)

const currentItem = ref<Item>(items.value[0])
const newItem = ref<Item | null>(null)
const canAddNewItem = ref(true)
const showDialog = ref(false)
const canSave = ref(false)
// const wasItemsChange = ref(false)

const validForm = ref<HTMLFormElement|null>(null)

const isActive = (item: Item): boolean => {
    const currentIndex = `${currentItem.value.id}${currentItem.value.uid}`
    const itemIndex = `${item.id}${item.uid}`
    return currentIndex === itemIndex
}

const addNewItem = () => {
    newItem.value = Empty.Item()
    newItem.value.uid = Date.now().toString(36)
    items.value.push(newItem.value)
    currentItem.value = newItem.value
    canAddNewItem.value = false
    showDialog.value=true
}
const removeItem = (item: Item) => {
    const index = items.value.indexOf(item)
    index >= 0 && items.value.splice(index, 1)
    currentItem.value = items.value.at(-1) || items.value[0]
}

const changeItem = (item: Item) => {
    currentItem.value = item
    showDialog.value = true
}

const toSave = () => {
    canSave.value = true
    setTimeout(() => {
        canSave.value = false
    }, 200)
    showDialog.value = false
}

const unwatchItems = watch([items], () => {
    currentItem.value = items.value[0]
},)

const unwatchNewItem = watch([newItem], () => {
    if (!newItem.value) return
    if (newItem.value.technology.drawingNumber && newItem.value.technology.drawingNumber && newItem.value.quantity) {
        canAddNewItem.value = true
    }
}, {deep: true})

const unwatchShowDialog = watch([showDialog], () => {
    if (showDialog.value || canAddNewItem.value) return
    items.value.pop()
    canAddNewItem.value = true

    // !canAddNewItem.value && (showDialog.value = true)
})

onUnmounted(() => {
    unwatchItems()
    unwatchNewItem()
    unwatchShowDialog()
    // unwatchCurrentItem()
})
</script>


<style scoped lang="sass">
.order-items
    display: grid
    grid-template-columns: repeat(2, 1fr)
    gap: 0.5em

    @media (width < 1024px)
        grid-template-columns: auto

    &__desktop-details
        @media (width < 1024px)
            display: none

    &__mobile-details
        display: none
        @media (width < 1024px)
            display: block

    &__mobile-card
        padding: 1em

    &__mobile-title
        text-align: center

</style>
