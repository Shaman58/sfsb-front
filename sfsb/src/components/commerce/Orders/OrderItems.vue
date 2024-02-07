<template lang="pug">
    .order-card__items
        v-list.order-card__items-list
            v-list-item(@click="addNewItem" :disabled="!canAddNewItem") Добавить новую позицию
            v-list-item(v-for="(i,index) in items" @click="currentItem = i" :key="index"
                :active="isActive(i)")
                OrderItem(:item="i" @remove="removeItem(i)")
        .order-card__details-item(v-if="currentItem" ref="itemForm")
            v-text-field.item-card__schema-number(label="Децимальный номер:"
                v-model="currentItem.technology.drawingNumber"
                placeholder="42"
                :rules="[rules.required]"
            )
            v-text-field.item-card__schema-name(label="Название чертежа:"
                v-model="currentItem.technology.drawingName"
                placeholder="Гайка M10"
                :rules="[rules.required]"
            )
            v-text-field.item-card__schema-amount(label="Количество:"
                v-model="currentItem.quantity"
                type="number"
                placeholder="100"
                :rules="[rules.required]"
            )
            v-switch.item-card__outsource-material(v-model="currentItem.customerMaterial",
                :label="currentItem.customerMaterial ? 'Материал заказчика' : 'Наш материал'")

</template>
<script setup lang="ts">

import OrderItem from "@/components/commerce/Orders/OrderItem.vue";
import {useValidationRules} from "@/mixins/FieldValidationRules";
import {ref, toRefs, watch} from "vue";
import emptyItem from "@/components/commerce/Orders/EmptyItem";

const props = defineProps<{ items: Item[] }>()
const {items} = toRefs(props)

const {rules} = useValidationRules()

const currentItem = ref(items.value[0])
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

watch([newItem], () => {
    if (!newItem.value) return
    if (newItem.value.technology.drawingNumber && newItem.value.technology.drawingNumber && newItem.value.quantity) {
        canAddNewItem.value = true
    }
}, {deep: true})

watch(items, () => {
    currentItem.value = items.value[0]
})
</script>


<style scoped lang="sass">

</style>
