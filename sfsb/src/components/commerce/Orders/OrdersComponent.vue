<template lang="pug">
    LayoutPage.orders
        template(#title) Заявки
        template(#filter)
            v-text-field(label="фильтр" v-model="filterText")
        template(#list)
            v-list.orders__list
                v-list-item(@click="addNew")
                    span(:style="{color:'orange'}") Добавить новый заказ
                v-list-item(v-for="i in orders" @click="currentOrder=i"
                    :key="i.id" :active="currentOrder.id===i.id") {{i.id}} {{i.customer.companyName}}
        template(#card)
            v-progress-linear(v-show="loading" :indeterminate="true"  color="#2F477E")
            OrderCard(v-model:order="currentOrder"  @save="save" @refresh="refresh")

</template>
<script setup lang="ts">
import {storeToRefs} from "pinia";
import {ref, watch} from "vue";
import LayoutPage from "@/components/common/LayoutPage.vue";
import {useOrdersStore} from "@/pinia-store/orders";
import OrderCard from "@/components/commerce/Orders/OrderCard.vue";
import emptyOrder from "@/components/commerce/Orders/EmptyOrder";

const {orders, loading} = storeToRefs(useOrdersStore())
const {getOrders, saveOrder} = useOrdersStore()
!orders.value.length && await getOrders()

const filterText = ref("")
const currentOrder = ref<Order>(orders.value[0])

const addNew = () => {
    currentOrder.value = emptyOrder() as Order
}

const save = async (event: Order) => {
    await saveOrder(currentOrder.value)
}

const refresh = async () => {
    await getOrders()
    currentOrder.value = orders.value.find((i) => i.id === currentOrder.value.id) || currentOrder.value

}

watch([currentOrder], () => {
    console.log("=>(OrdersComponent.vue:35) currentOrder", currentOrder.value);
}, {deep: true})

</script>
<style scoped lang="sass">
.orders

    &__list
        height: 100%
        border-radius: .5rem
        padding: .5rem
</style>
