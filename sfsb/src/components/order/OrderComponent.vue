<template lang="pug">
    v-container
        order-preview-card(v-if="orders" @click.stop="visible=true"  :orders="orders")
        order-list-dialog(v-if="orders" :visible="visible" :orders="orders" :customers="customers" :active="active" @hide="visible=false" @save="void save($event)" @remove="void remove($event)")
</template>

<script setup lang="ts">

import OrderPreviewCard from "@/components/order/OrderPreviewCard.vue";
import OrderListDialog from "@/components/order/OrderListDialog.vue";
import {ref} from "vue";
import {storeToRefs} from "pinia";
import {useOrdersStore} from "@/pinia-store/orders";
import {useCustomersStore} from "@/pinia-store/customers";


const {orders} = storeToRefs(useOrdersStore())
const {getOrders, saveOrder, deleteOrder} = useOrdersStore()
await getOrders()

const {customers} = storeToRefs(useCustomersStore())
const visible = ref(false);
const active = ref(-1);

const save = async (data: Order) => {
    // const response = await store.dispatch("saveOrder", data);
    const response = await saveOrder(data)
    active.value = response.id;
};

const remove = async (data: Order) => await deleteOrder(data);

</script>
