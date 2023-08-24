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

<script>

import CustomerComponent from "@/components/customer/CustomerComponent.vue";
import OrderComponent from "@/components/order/OrderComponent.vue";

export default {
  name: "Commerce",
  components: {OrderComponent, CustomerComponent},
}
</script>
