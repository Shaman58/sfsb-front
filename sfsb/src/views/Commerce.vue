<template>
  <br>
  <v-container>
    <v-row>
      <v-col cols="6">
        <customer-component/>
      </v-col>
      <v-col cols="6">
        <order-component/>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>

import CustomerComponent from "@/components/customer/CustomerComponent.vue";
import OrderComponent from "@/components/order/OrderComponent.vue";
import {onMounted} from "vue";
import {useStore} from "vuex";

const store = useStore();

onMounted(() => {
  store.dispatch("fetchCustomers");
  store.dispatch("fetchOrders");
  store.dispatch("fetchEmployees");
});

</script>
