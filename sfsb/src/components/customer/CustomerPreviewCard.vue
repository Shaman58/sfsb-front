<template>
  <v-card>
    <v-list @click="showCustomerDialog()">
      <v-list-subheader>Контрагенты:</v-list-subheader>
      <v-list-item
        v-for="item in customers"
        :key="item.id"
        :value="item"
        color="primary"
        :title="item.companyName">
      </v-list-item>
    </v-list>
  </v-card>
</template>

<script setup>
import {computed} from "vue";
import {useStore} from "vuex";

const store = useStore();

const customers = computed(() => store.getters.getCustomers.slice(0, 3));
const isCustomerDialogVisible = computed(() => store.getters.isCustomerDialogVisible);

const showCustomerDialog = () => {
  store.commit("setCustomerDialog", true);
};

</script>
