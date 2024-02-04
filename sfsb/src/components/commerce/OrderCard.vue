<template lang="pug">
    .order-card
        v-toolbar.order-card__controls.pa-2
            v-menu
                template(#activator="{ props }")
                    v-btn(color="primary" v-bind="props" :disabled="!isOrderComputed")
                        ControlButton(tooltip="Коммерческое предложение" icon-name="mdi-offer")
                v-list(@click:select="selectCompany")
                    v-list-item(v-for="company in companiesList" :key="company.id" :value="company.companyName")
                        v-list-item-title {{ company.companyName }}
            ControlButton(@click="order && void previewToolOrder(order, 1, 2)" :disabled="!isAllComputed" tooltip="Заявка на инструмент" icon-name="mdi-tools")
            ControlButton(@click="order && void previewPlan1(order)" :disabled="!isAllComputed" tooltip="План1" icon-name="mdi-list-status")
            ControlButton(@click="order && void previewPlan2(order)" :disabled="!isAllComputed"  tooltip="План2" icon-name="mdi-list-status")
            v-spacer
            ControlButton(@click="refresh"  tooltip="Обновить" icon-name="mdi-refresh")
            ControlButton(@click="save" color="orange-darken-1" variant="text" type="submit" :disabled="!valid" tooltip="Сохранить" icon-name="mdi-floppy")
        v-form.order-card__form(ref="form" v-model="valid")
            v-expansion-panels.order-card__container(:multiple="true" v-model="panel" )
                v-expansion-panel.order-card__common(value="common")
                    v-expansion-panel-title ОБЩИЕ ДАННЫЕ
                    v-expansion-panel-text
                        div(style="margin-top: 1rem;" v-if="order && order.user") Автор:
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

import {computed, type ModelRef, ref, watch, watchEffect} from "vue";
import OrderItem from "@/components/commerce/OrderItem.vue";
import SuspendedComponent from "@/components/common/SuspendedComponent.vue";
import OrderFiles from "@/components/commerce/OrderFiles.vue";
import {useValidationRules} from "@/mixins/FieldValidationRules";
import {useCompaniesStore} from "@/pinia-store/companies";
import {useOfferGenerator} from "@/mixins/OfferGenerator";
import {storeToRefs} from "pinia";
import {useCustomersStore} from "@/pinia-store/customers";
import ControlButton from "@/components/commerce/ControlButton.vue";
import emptyItem from "@/components/commerce/EmptyItem";

const order: ModelRef<Order | undefined, string> = defineModel("order")
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

const {getShortList} = useCompaniesStore()
const companiesList = await getShortList()
const companies = companiesList.map(company => company.companyName)

const {customers} = storeToRefs(useCustomersStore())
const {fetchCustomers} = useCustomersStore()
!customers.value.length && await fetchCustomers()

const {previewCommerce, previewToolOrder, previewPlan1, previewPlan2} = useOfferGenerator();

const isAllComputed = computed(() => order.value?.items.every((e: Item) => e.technology.computed))
const isAllWorkpieced = computed(() => order.value?.items.every((e: Item) => e.customerMaterial || e.technology.assembly || e.technology.workpiece.material.price.amount))
const isOrderComputed = computed(() => isAllComputed.value && isAllWorkpieced.value)
const isActive = (item: Item): boolean => {
    const currentIndex = `${currentItem.value.id}${currentItem.value.uid}`
    const itemIndex = `${item.id}${item.uid}`
    return currentIndex === itemIndex
}

const selectCompany = async ({id}: { id: string }) => {
    const selectedCompany = companiesList.find(company => company.companyName === id)
    const selectedId = selectedCompany && selectedCompany.id
    order.value && await previewCommerce(order.value, selectedId)
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
    grid-template-rows: 50px 1fr
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
