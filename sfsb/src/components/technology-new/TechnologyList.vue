<template lang="pug">
    v-list.technology-card
        v-list-item(v-for='order in orders', :key='order.id' :active="order.id===page")
            router-link.technology-card__link(:to='`/technology/${order.id}`')
                span {{order.applicationNumber}} {{order.customer.companyName}}
</template>
<script setup lang="ts">
import {storeToRefs} from "pinia";
import {computed, toRefs} from "vue";
import {useRoute, useRouter} from "vue-router";
import {useOrdersStore} from "@/pinia-store/orders";

const {orders} = storeToRefs(useOrdersStore())
const {getOrders} = useOrdersStore()
!orders.value.length && await getOrders()

const router = useRouter();
const {path} = toRefs(useRoute())
const page = computed(() => path.value.split("/").at(-1))


const firstId = computed(() => orders.value.length && orders.value[0].id)
page.value === "staff" && await router.push(`/staff/${firstId.value}`)


</script>


<style scoped lang="sass">
.technology-card

    &__link
        color: #000
        text-decoration: none
</style>
