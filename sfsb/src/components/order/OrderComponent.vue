<template>
  <v-container>
    <order-preview-card/>
    <order-list-dialog/>
    <order-create-dialog/>
  </v-container>
</template>

<script>

import OrderPreviewCard from "@/components/order/OrderPreviewCard.vue";
import OrderListDialog from "@/components/order/OrderListDialog.vue";
import OrderCreateDialog from "@/components/order/OrderCreateDialog.vue";

export default {
  name: "order-component",
  components: {OrderCreateDialog, OrderListDialog, OrderPreviewCard},
  mounted() {
    this.$store.dispatch("fetchAllOrdersData");
    this.$store.dispatch("fetchEmployees");
    this.$store.dispatch("fetchAllTechnologiesData");
  }
}
</script>
