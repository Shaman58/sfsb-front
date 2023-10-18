<template>
  <v-card class="mx-auto" max-width="400">
    <v-list dense>
      <v-list-subheader>Управление заявками</v-list-subheader>
      <v-list-item v-for="(item, index) in lastOrders"
                   :key="index"
                   :value="item"
                   :title="`№${item.applicationNumber} ${item.customer.companyName}`"
                   color="primary"
      >
      </v-list-item>
      <v-list-item>
        <v-list-item-title>...</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-card>
</template>
<script setup>
import {computed, ref} from "vue";

const props = defineProps({
  orders: {
    type: Array,
    required: true
  },
});

const lastOrders = computed(() => {
  return [...props.orders].sort((a, b) => {
    const aDate = a.updated || a.created;
    const bDate = b.updated || b.created;
    return new Date(bDate) - new Date(aDate);
  }).slice(0, 3);
});

</script>
