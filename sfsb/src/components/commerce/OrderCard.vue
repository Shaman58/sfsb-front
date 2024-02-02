<template lang="pug">
    .order-card
        .order-card__container
            .order-card__controls
                v-select(@update:modelValue="selectCompany" label="компред" :items="companies" :disabled="!isOrderComputed" variant="underlined" )
                v-btn(@click="previewToolOrder(order, 1, 2)" :disabled="!isAllComputed") заявка на инструмент
                v-btn(@click="previewPlan1(order)" :disabled="!isAllComputed") План 1
                v-btn(@click="previewPlan2(order)" :disabled="!isAllComputed") План 2
                v-spacer
                v-btn(color="orange-darken-1" variant="text" type="submit" :disabled="!valid") {{ order.id ? 'Изменить' : 'Создать' }}
            .order-card__items
                v-list.order-card__items-list
                    v-list-item(@click="addNewItem") Добавить новую позицию
                    v-list-item(v-for="i in order.items" @click="currentItem = i" :key="i.id"
                        :active="currentItem.id===i.id")
                        OrderItem(:item="i")
            .order-card__details
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
            .order-card__files
                suspended-component
                    OrderFiles(:order-id="order.id")

            .order-card__description
                v-textarea(v-model="description")
                v-textarea(v-model="businessProposal")


</template>
<script setup lang="ts">

import {computed, ref, toRefs, watchEffect} from "vue";
import OrderItem from "@/components/commerce/OrderItem.vue";
import SuspendedComponent from "@/components/common/SuspendedComponent.vue";
import OrderFiles from "@/components/commerce/OrderFiles.vue";
import {useValidationRules} from "@/mixins/FieldValidationRules";
import {useCompaniesStore} from "@/pinia-store/companies";
import {useOfferGenerator} from "@/mixins/OfferGenerator";

const props = defineProps<{ order: Order }>()
const {order} = toRefs(props)

const description = ref(order.value.description)
const businessProposal = ref(order.value.businessProposal)

const {rules} = useValidationRules()

const currentItem = ref<Item>(order.value.items[0])

const {getShortList} = useCompaniesStore()
const companiesList = await getShortList()
const companies = companiesList.map(company => company.companyName)

const {previewCommerce, previewToolOrder, previewPlan1, previewPlan2} = useOfferGenerator();

const isAllComputed = computed(() => order.value.items.every((e: Item) => e.technology.computed))
const isAllWorkpieced = computed(() => order.value.items.every((e: Item) => e.customerMaterial || e.technology.assembly || e.technology.workpiece.material.price.amount))
const isOrderComputed = computed(() => isAllComputed.value && isAllWorkpieced.value)

const selectCompany = async (e: string) => {
    const selectedCompany = companiesList.find(company => company.companyName === e)
    const selectedId = selectedCompany && selectedCompany.id
    await previewCommerce(order.value, selectedId)
}
const addNewItem = () => {
}

watchEffect(() => currentItem.value = order.value.items[0])
watchEffect(() => businessProposal.value = order.value.businessProposal)
watchEffect(() => description.value = order.value.description)
</script>
<style scoped lang="sass">
.order-card
    --scroll-color: rgba(47, 71, 126, 0.5)
    height: 100%
    background: #00acc120

    &__container
        height: 100%
        display: grid
        grid-template-rows: 80px 240px 1fr 68px 1fr
        row-gap: 5px

        & > *
            height: 100%
            overflow-y: auto
            border-radius: .5rem
            padding: .5rem

            &::-webkit-scrollbar
                width: 4px
                background-color: transparent

            &::-webkit-scrollbar-thumb
                width: 4px
                background-color: var(--scroll-color)
                border-radius: 8px

    &__controls
        background-color: #fff

    &__items
        background-color: #fff

    &__description
        display: flex
        gap: 0.5rem
        background-color: #fff

    &__details
        background-color: #fff
        display: flex
        align-items: center
        column-gap: 0.5rem

        & > *
            flex: 1 1 100%

    &__files
        padding: 0

    &__controls
        display: flex
        align-items: center
        gap: .5rem
</style>
