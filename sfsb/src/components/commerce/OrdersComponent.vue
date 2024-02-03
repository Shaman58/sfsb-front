<template lang="pug">
    LayoutPage.orders
        template(#title) Заявки
        template(#filter)
            v-text-field(label="фильтр" v-model="filterText")
        template(#list)
            v-list.orders__list
                v-list-item(@click="addNew") Добавить новый заказ
                v-list-item(v-for="i in orders" @click="currentOrder=i"
                    :key="i.id" :active="currentOrder.id===i.id") {{i.id}} {{i.customer.companyName}}
        template(#card)
            OrderCard(v-model:order="currentOrder")

</template>
<script setup lang="ts">
import {storeToRefs} from "pinia";
import {ref} from "vue";
import LayoutPage from "@/components/common/LayoutPage.vue";
import {useOrdersStore} from "@/pinia-store/orders";
import OrderCard from "@/components/commerce/OrderCard.vue";
import emptyOrder from "@/components/commerce/EmptyOrder";

const {orders} = storeToRefs(useOrdersStore())
const {getOrders} = useOrdersStore()
!orders.value.length && await getOrders()

const filterText = ref("")
const currentOrder = ref<Order>(orders.value[0])

const addNew = () => {
    currentOrder.value = emptyOrder()
}

</script>
<style scoped lang="sass">
.orders

    &__list
        height: 100%
        border-radius: .5rem
        padding: .5rem
</style>
