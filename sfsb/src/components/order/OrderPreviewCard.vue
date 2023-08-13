<template>
  <v-card class="mx-auto" max-width="400">
    <v-list dense @click="showDialog">
      <v-list-subheader>Управление заявками</v-list-subheader>
      <v-list-item
        v-for="item in lastOrders"
        :key="item.id"
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
<script>
import {computed, reactive} from "vue";
import {useStore} from "vuex";

export default {
  name: "order-preview-card",
  setup() {
    const store = useStore();

    const orders = computed(() => store.getters.getOrders);

    const lastOrders = computed(() => {
      return [...orders.value].sort((a, b) => {
        const aDate = a.updated || a.created;
        const bDate = b.updated || b.created;
        return new Date(bDate) - new Date(aDate);
      }).slice(0, 3);
    });

    const showDialog = () => {
      store.commit("setOrdersListDialog", true);
    };

    return {
      lastOrders,
      showDialog,
    };
  },
};
</script>
