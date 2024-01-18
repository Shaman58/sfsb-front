<template lang="pug">
    v-container(v-if="customers")
        customer-preview-card(:customers="preview" @click="setVisible")
        customer-list-dialog(:customers="customers" v-if="visible" :visible="visible" @hide="visible=false" @save="save($event)" @remove="remove($event)")
</template>

<script setup lang="ts">
import CustomerPreviewCard from "@/components/customer/CustomerPreviewCard.vue";
import CustomerListDialog from "@/components/customer/CustomerListDialog.vue";
import {computed, ref} from "vue";
import {storeToRefs} from "pinia";
import {useCustomersStore} from "@/pinia-store/customers";


const {customers, loading} = storeToRefs(useCustomersStore())
const {fetchCustomers, saveCustomer, deleteCustomer} = useCustomersStore()

const preview = computed(() => customers.value.slice(0, 3));
const visible = ref(false);

await fetchCustomers()

const setVisible = () => {
    visible.value = !visible.value;
}

const save = async (data: Customer) => await saveCustomer(data)

const remove = async (data: Customer) => await deleteCustomer(data)


</script>
