<template>
  <v-container>
    <order-preview-card/>
    <order-list-dialog/>
    <order-create-dialog/>
  </v-container>
</template>

<script setup>

import OrderPreviewCard from "@/components/order/OrderPreviewCard.vue";
import OrderListDialog from "@/components/order/OrderListDialog.vue";
import OrderCreateDialog from "@/components/order/OrderCreateDialog.vue";
import {useStore} from "vuex";
import {onMounted} from "vue";

const store = useStore();

onMounted(() => {
  store.dispatch("fetchOrders");
  store.dispatch("fetchEmployees");
  store.dispatch("fetchTechnologies");
});

</script>
