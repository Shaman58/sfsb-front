<template>
  <v-container>

    <order-preview-card v-if="orders"
                        @click.stop="visible=true"
                        :orders="orders"
    />

    <order-list-dialog v-if="orders"
                       :visible="visible"
                       :orders="orders"
                       :customers="customers"
                       :active="active"
                       @hide="visible=false"
                       @save="save($event)"
                       @remove="remove($event)"
    />
  </v-container>
</template>

<script setup>

import OrderPreviewCard from "@/components/order/OrderPreviewCard.vue";
import OrderListDialog from "@/components/order/OrderListDialog.vue";
import {useStore} from "vuex";
import {computed, ref} from "vue";

const store = useStore();

const orders = computed(() => store.getters.getOrders);
const customers = computed(() => store.getters.getCustomers);
const visible = ref(false);
const active = ref(-1);

const save = async (data) => {
  const response = await store.dispatch("saveOrder", data);
  active.value = response.id;
};

const remove = (data) => store.dispatch("deleteOrder", data);

</script>
