<template>
  <br>
  <customer-component/>
  <order-component/>
</template>

<script>

import CustomerComponent from "@/components/customer/CustomerComponent.vue";
import OrderComponent from "@/components/order/OrderComponent.vue";

export default {
  name: "Commerce",
  components: {OrderComponent, CustomerComponent},
}
</script>
