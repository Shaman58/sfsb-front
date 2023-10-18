<template>
  <v-container v-if="customers">
    <customer-preview-card :customers="preview"
                           @click.stop="visible=true"
    />
    <customer-list-dialog :customers="customers"
                          :visible="visible"
                          @hide="visible=false"
                          @save="save($event)"
                          @remove="remove($event)"
                          @saveContact="saveContact($event)"
                          @removeContact="removeContact($event)"
    />
  </v-container>
</template>

<script setup>
import CustomerPreviewCard from "@/components/customer/CustomerPreviewCard.vue";
import CustomerListDialog from "@/components/customer/CustomerListDialog.vue";
import {computed, ref} from "vue";
import {useStore} from "vuex";

const store = useStore();

const customers = computed(() => store.getters.getCustomers);
const preview = computed(() => customers.value.slice(0, 3));
const visible = ref(false);

const save = (data) => {
  store.dispatch("saveCustomer", data);
};

const remove = (data) => {
  store.dispatch("deleteCustomer", data);
};

const saveContact = async (data) => {
  await store.dispatch("saveContact", data);
  await store.dispatch("fetchCustomers");
};

const removeContact = async (data) => {
  await store.dispatch("deleteContact", data);
  await store.dispatch("fetchCustomers");
};

</script>
