<template lang="pug">
    LayoutMain
        template(#header)
            OrderToolbar(:order :valid @save="save" @refresh="refresh")
        .order-card
            v-form.order-card__form(ref="form" v-model="valid")
                v-expansion-panels.order-card__container(:multiple="true" v-model="panel" )
                    v-expansion-panel.order-card__common(value="common")
                        v-expansion-panel-title ОБЩИЕ ДАННЫЕ
                        v-expansion-panel-text
                            div(style="margin-bottom: 1rem;" v-if="order && order.user") Автор:
                                strong {{ order?.user.lastName }}&nbsp;
                                strong {{ order?.user.firstName }}
                            v-row(v-if="orderLocal")
                                v-col(cols="3")
                                    v-text-field(label="Номер заявки:" v-model="orderLocal.applicationNumber" :rules="[rules.required]" maxlength="5")
                                v-col(cols="9")
                                    v-select(v-if="customers" :items="customers" :item-title="'companyName'" return-object v-model="orderLocal.customer" :rules="[rules.required]" @update:modelValue="orderLocal && (orderLocal.contact = null)" label="Заказчик")
                    v-expansion-panel.order-card__group-items(value="items")
                        v-expansion-panel-title ПОЗИЦИИ ЗАКАЗА
                        v-expansion-panel-text
                            .order-card__items
                                v-list.order-card__items-list
                                    v-list-item(@click="addNewItem" :disabled="!canAddNewItem") Добавить новую позицию
                                    v-list-item(v-for="(i,index) in orderLocal.items" @click="currentItem = i" :key="index"
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

                    v-expansion-panel.order-card__files(value="files")
                        v-expansion-panel-title ФАЙЛЫ
                        v-expansion-panel-text
                            suspended-component
                                OrderFiles(:order-id="order?.id")

                    v-expansion-panel.order-card__descriptions(value="descriptions")
                        v-expansion-panel-title ДОПОЛНИТЕЛЬНЫЕ ДАННЫЕ
                        v-expansion-panel-text
                            v-textarea(v-model="description")
                            v-textarea(v-model="businessProposal")


</template>
<script setup lang="ts">

import {ref, watch, watchEffect} from "vue";
import OrderItem from "@/components/commerce/Orders/OrderItem.vue";
import SuspendedComponent from "@/components/common/SuspendedComponent.vue";
import OrderFiles from "@/components/commerce/Orders/OrderFiles.vue";
import {useValidationRules} from "@/mixins/FieldValidationRules";
import {storeToRefs} from "pinia";
import {useCustomersStore} from "@/pinia-store/customers";
import emptyItem from "@/components/commerce/Orders/EmptyItem";
import LayoutMain from "@/components/common/LayoutMain.vue";
import OrderToolbar from "@/components/commerce/Orders/OrderToolbar.vue";

const order = defineModel<Order>("order")
const emit = defineEmits(["save", "refresh"])

const orderLocal = ref<Order>(order.value as Order)

const description = ref(order.value?.description)
const businessProposal = ref(order.value?.businessProposal)

const form = ref<HTMLFormElement>()
const valid = ref(false)
const panel = ref<string[]>(["items"])

const canAddNewItem = ref(true)

const {rules} = useValidationRules()

const currentItem = ref(orderLocal.value.items[0])
const newItem = ref<Item | null>(null)


const {customers} = storeToRefs(useCustomersStore())
const {fetchCustomers} = useCustomersStore()
!customers.value.length && await fetchCustomers()


const isActive = (item: Item): boolean => {
    const currentIndex = `${currentItem.value.id}${currentItem.value.uid}`
    const itemIndex = `${item.id}${item.uid}`
    return currentIndex === itemIndex
}


const addNewItem = () => {
    newItem.value = emptyItem()
    newItem.value.uid = Date.now().toString(36)
    orderLocal.value && orderLocal.value.items.push(newItem.value)
    currentItem.value = newItem.value
    canAddNewItem.value = false
}

const removeItem = (item: Item) => {
    const index = orderLocal.value.items.indexOf(item)
    index >= 0 && orderLocal.value.items.splice(index, 1)
}
const refresh = () => {
    emit("refresh")
}
const save = () => {
    emit("save")
}
watchEffect(() => {
    orderLocal.value = order.value as Order
    currentItem.value = (order.value as Order).items[0]
    businessProposal.value = order.value?.businessProposal
    description.value = order.value?.description
})

watch([orderLocal], () => {
    console.log("orderLocal", orderLocal.value)
    order.value = orderLocal.value
}, {deep: true})

watch([newItem], () => {
    if (!newItem.value) return
    if (newItem.value.technology.drawingNumber && newItem.value.technology.drawingNumber && newItem.value.quantity) {
        canAddNewItem.value = true
    }
}, {deep: true})


</script>
<style scoped lang="sass">
.order-card
    display: grid
    gap: 0.5rem
    height: 100%


    &__form
        height: 100%
        overflow-y: auto

        &::-webkit-scrollbar
            width: 4px
            background-color: transparent

        &::-webkit-scrollbar-thumb
            width: 4px
            background-color: var(--scroll-color)
            border-radius: 8px

    &__details-content
        display: flex
        align-items: center
        gap: 0.5rem

        & > *
            flex: 1 1

    &__controls
        display: flex
        align-items: center

    &__items
        display: grid
        grid-template-columns: repeat(2, 1fr)
        gap: 0.5rem
        height: min(500px, 100%)

    &__items-list
        height: 100%
        overflow-y: auto

        &::-webkit-scrollbar
            width: 4px
            background-color: transparent

        &::-webkit-scrollbar-thumb
            width: 4px
            background-color: var(--scroll-color)
            border-radius: 8px

</style>
