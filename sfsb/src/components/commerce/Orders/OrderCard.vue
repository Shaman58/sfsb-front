<template lang="pug">
    LayoutMain
        template(#header)
            OrderToolbar(:order="orderLocal" :valid="valid"  @save="save" @refresh="refresh")
        .order-card
            v-form.order-card__form(ref="form" v-model="valid")
                v-expansion-panels.order-card__container(:multiple="true" v-model="panel" )

                    v-expansion-panel.order-card__common(value="common")
                        v-expansion-panel-title ОБЩИЕ ДАННЫЕ
                        v-expansion-panel-text
                            div(style="margin-bottom: 1rem;" v-if="orderLocal && orderLocal.user")
                                span Автор:&nbsp;
                                strong {{ orderLocal.user.lastName }}&nbsp;
                                strong {{ orderLocal.user.firstName }}
                            v-row(v-if="orderLocal")
                                v-col(cols="3")
                                    v-text-field(label="Номер заявки:" v-model="orderLocal.applicationNumber" :rules="[rules.required]" maxlength="5")
                                v-col(cols="9")
                                    v-select(v-if="customers" :items="customers" :item-title="'companyName'" return-object v-model="orderLocal.customer" :rules="[rules.required]" @update:modelValue="orderLocal && (orderLocal.contact = null)" label="Заказчик")

                    v-expansion-panel.order-card__group-items(value="items")
                        v-expansion-panel-title ПОЗИЦИИ ЗАКАЗА
                        v-expansion-panel-text
                            OrderItems(:items="orderLocal.items")

                    v-expansion-panel.order-card__files(value="files")
                        v-expansion-panel-title ФАЙЛЫ
                        v-expansion-panel-text
                            suspended-component
                                OrderFiles(:order-id="orderLocal.id")

                    v-expansion-panel.order-card__descriptions(value="descriptions")
                        v-expansion-panel-title ДОПОЛНИТЕЛЬНЫЕ ДАННЫЕ
                        v-expansion-panel-text
                            v-textarea(v-model="orderLocal.description")
                            v-textarea(v-model="orderLocal.businessProposal")


</template>
<script setup lang="ts">

import {computed, ref, toRefs, watch, watchEffect} from "vue";
import SuspendedComponent from "@/components/common/SuspendedComponent.vue";
import OrderFiles from "@/components/commerce/Orders/OrderFiles.vue";
import {useValidationRules} from "@/mixins/FieldValidationRules";
import {storeToRefs} from "pinia";
import {useCustomersStore} from "@/pinia-store/customers";
import LayoutMain from "@/components/common/LayoutMain.vue";
import OrderToolbar from "@/components/commerce/Orders/OrderToolbar.vue";
import OrderItems from "@/components/commerce/Orders/OrderItems.vue";
import {useRoute, useRouter} from "vue-router";
import {useOrdersStore} from "@/pinia-store/orders";
import emptyOrder from "@/components/commerce/Orders/EmptyOrder";

const router = useRouter()
const {params} = toRefs(useRoute())

const {orders, loading} = storeToRefs(useOrdersStore())
const {saveOrder, getOrders} = useOrdersStore()

const hasCurrentOrder = orders.value.find(e => e.id + "" === params.value.id)
if (!hasCurrentOrder) router.push("/not-found")

const order = computed(() => params.value.id === 'new' ? emptyOrder() : orders.value.find(e => e.id + "" === params.value.id) || orders.value[0])

const orderLocal = ref<Order>(order.value as Order)

// const description = ref(orderLocal.value?.description)
// const businessProposal = ref(orderLocal.value?.businessProposal)

const form = ref<HTMLFormElement>()
const valid = ref(false)
const panel = ref<string[]>(["items"])

const {rules} = useValidationRules()

const {customers} = storeToRefs(useCustomersStore())
const {fetchCustomers} = useCustomersStore()
!customers.value.length && await fetchCustomers()

const refresh = async () => {
    await getOrders()
}
const save = async () => {
    await saveOrder(orderLocal.value)
    await getOrders()
    const id = orders.value.find(e => e.applicationNumber === orderLocal.value.applicationNumber)
    id && await router.push(`/commerce/orders/${id}`)
}
watchEffect(() => {
    orderLocal.value = order.value as Order
    // businessProposal.value = order.value?.businessProposal
    // description.value = order.value?.description
})

watch([orderLocal], () => {
    console.log("orderLocal", orderLocal.value)
}, {deep: true})

watch([params], () => {
    console.log("params", params.value)
})


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
