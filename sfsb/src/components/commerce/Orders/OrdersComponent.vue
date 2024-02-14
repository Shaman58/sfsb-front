<template lang="pug">
    LayoutPage.orders
        template(#title) Заявки
        template(#filter)
            v-text-field(label="фильтр" v-model="filterText" clearable)
        template(#list)
            v-list.orders__list
                v-list-item(@click="()=>{}" :active="id==='new'")
                    router-link.list-link.orders__link(:to="'/commerce/orders/new'")
                        span(:style="{color:'orange'}") Добавить новый заказ
                v-list-item(v-for="i in filteredOrders" :key="i.id" :active="+id===i.id" @click="()=>{}")
                    router-link.list-link.orders__link(:to="`/commerce/orders/${i.id}`") {{i.applicationNumber}} {{i.customer.companyName}}
        template(#card)
            router-view

</template>
<script setup lang="ts">
import {storeToRefs} from "pinia";
import {computed, ref, toRefs, watch} from "vue";
import LayoutPage from "@/components/common/LayoutPage.vue";
import {useOrdersStore} from "@/pinia-store/orders";
import {useRoute, useRouter} from "vue-router";

const router = useRouter();

const {orders, loading} = storeToRefs(useOrdersStore())
const {getOrders, saveOrder} = useOrdersStore()
!orders.value.length && await getOrders()

const {path} = toRefs(useRoute())
const id = computed(() => path.value.split("/").at(-1))
id.value === "orders" && router.push(`/commerce/orders/${orders.value[0].id}`)

const filterText = ref("")
const filteredOrders = computed<Order[]>(() => orders.value.filter(e => e.customer
        .companyName
        .toLowerCase()
        .includes(filterText.value?.toLowerCase()||"")
        || e.applicationNumber.toString().includes(filterText.value?.toLowerCase()||"")
    )
)

watch([id], () => {
    console.log("params id", id.value)
})

</script>
<style scoped lang="sass">
.orders

    &__list
        height: 100%
        border-radius: .5rem
        padding: .5rem

    &__link
        text-decoration: none
        color: inherit
</style>
