<template>
  <v-dialog v-model="isCustomerDialogVisible" width="800" persistent>
    <v-card title="Контрагенты:">
      <v-list>
        <v-list-item
          v-for="item in customers"
          :key="item.id"
          :value="item"
          :title="item.companyName"
          @click="showCompanyDialog(item)">
          <template v-slot:append>
            <v-btn
              color="orange-lighten-1"
              icon="mdi-delete"
              variant="text"
              :disabled="item.contacts?.length !== 0"
              @click.stop="deleteCustomer(item)"
            ></v-btn>
          </template>
        </v-list-item>
        <v-list-item title="...">
          <template v-slot:append>
            <v-btn
              color="orange-lighten-1"
              icon="mdi-plus"
              variant="text"
              @click="showCompanyDialog({})"
            ></v-btn>
          </template>
        </v-list-item>
      </v-list>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="orange-darken-1" variant="text" @click="hideDialog">Закрыть</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import {computed} from "vue";
import {useStore} from "vuex";

const store = useStore();

const customers = computed(() => store.getters.getCustomers);
const isCustomerDialogVisible = computed(() => store.getters.isCustomerDialogVisible);

const hideDialog = () => {
  store.commit("setCustomerDialog", false);
};

const showCompanyDialog = (company) => {
  store.commit("setSelectedCompany", {...company})
  store.commit("setCompanyDialog", true);
};

const deleteCustomer = (customer) => {
  store.dispatch("deleteCustomer", customer);
};
</script>
