<template lang="pug">
    .order-card
        v-toolbar.order-card__controls.pa-2
            v-menu()
                template(#activator="{ props }")
                    v-btn(color="primary" v-bind="props" :disabled="!isOrderComputed")
                        ControlButton(tooltip="Коммерческое предложение" icon-name="mdi-offer")
                v-list(@click:select="selectCompany")
                    v-list-item(v-for="company in companiesList" :key="company.id" :value="company.companyName")
                        v-list-item-title {{ company.companyName }}
            ControlButton(@click="void previewToolOrder(order, 1, 2)" :disabled="!isAllComputed" tooltip="Заявка на инструмент" icon-name="mdi-tools")
            ControlButton(@click="void previewPlan1(order)" :disabled="!isAllComputed" tooltip="План1" icon-name="mdi-list-status")
            ControlButton(@click="void previewPlan2(order)" :disabled="!isAllComputed"  tooltip="План2" icon-name="mdi-list-status")
            v-spacer
            ControlButton(color="orange-darken-1" variant="text" type="submit" :disabled="!valid" tooltip="Сохранить" icon-name="mdi-floppy")
        v-form.order-card__form(ref="form" v-model="valid")
            v-expansion-panels.order-card__container(:multiple="true" v-model="panel" )
                v-expansion-panel.order-card__common(value="common")
                    v-expansion-panel-title ОБЩИЕ ДАННЫЕ
                    v-expansion-panel-text
                        div(style="margin-top: 1rem;" v-if="order && order.user") Автор:
                            strong {{ order.user.lastName }}&nbsp;
                            strong {{ order.user.firstName }}
                        v-row
                            v-col(cols="3")
                                v-text-field(label="Номер заявки:" v-model="orderLocal.applicationNumber" :rules="[rules.required]" maxlength="5")
                            v-col(cols="9")
                                v-select(v-if="customers" :items="customers" :item-title="'companyName'" return-object v-model="orderLocal.customer" :rules="[rules.required]" @update:modelValue="orderLocal.contact = null" label="Заказчик")
                v-expansion-panel.order-card__group-items(value="items")
                    v-expansion-panel-title ПОЗИЦИИ ЗАКАЗА
                    v-expansion-panel-text
                        .order-card__items
                            v-list.order-card__items-list
                                v-list-item(@click="addNewItem") Добавить новую позицию
                                v-list-item(v-for="i in orderLocal.items" @click="currentItem = i" :key="i.id"
                                    :active="currentItem.id===i.id")
                                    OrderItem(:item="i")
                            .order-card__details-item(v-if="currentItem" )
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
                            OrderFiles(:order-id="order.id")

                v-expansion-panel.order-card__descriptions(value="descriptions")
                    v-expansion-panel-title ДОПОЛНИТЕЛЬНЫЕ ДАННЫЕ
                    v-expansion-panel-text
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
import {storeToRefs} from "pinia";
import {useCustomersStore} from "@/pinia-store/customers";
import ControlButton from "@/components/commerce/ControlButton.vue";
import emptyItem from "@/components/commerce/EmptyItem";

const props = defineProps<{ order: Order }>()
const {order} = toRefs(props)

const orderLocal = ref<Order>(order.value)

const description = ref(order.value.description)
const businessProposal = ref(order.value.businessProposal)

const form = ref<HTMLFormElement>()
const valid = ref(false)
const panel = ref<string[]>(["items"])

const {rules} = useValidationRules()

const currentItem = ref<Item>(order.value.items[0])

const {getShortList} = useCompaniesStore()
const companiesList = await getShortList()
const companies = companiesList.map(company => company.companyName)

const {customers} = storeToRefs(useCustomersStore())
const {fetchCustomers} = useCustomersStore()
!customers.value.length && await fetchCustomers()

const {previewCommerce, previewToolOrder, previewPlan1, previewPlan2} = useOfferGenerator();

const isAllComputed = computed(() => order.value.items.every((e: Item) => e.technology.computed))
const isAllWorkpieced = computed(() => order.value.items.every((e: Item) => e.customerMaterial || e.technology.assembly || e.technology.workpiece.material.price.amount))
const isOrderComputed = computed(() => isAllComputed.value && isAllWorkpieced.value)

const selectCompany = async ({id}: { id: string }) => {
    const selectedCompany = companiesList.find(company => company.companyName === id)
    const selectedId = selectedCompany && selectedCompany.id
    await previewCommerce(order.value, selectedId)
}
const addNewItem = () => {
    orderLocal.value.items.push(emptyItem())
}

watchEffect(() => {
    orderLocal.value = order.value
    currentItem.value = order.value.items[0]
    businessProposal.value = order.value.businessProposal
    description.value = order.value.description
})

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

</style>
