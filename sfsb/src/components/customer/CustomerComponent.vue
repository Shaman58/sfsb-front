<template>
  <customer-preview-card/>
  <customer-list-dialog/>
  <company-create-dialog/>
  <contact-list-dialog/>
  <employee-create-dialog/>
</template>

<script setup>
import CustomerPreviewCard from "@/components/customer/CustomerPreviewCard.vue";
import CustomerListDialog from "@/components/customer/CustomerListDialog.vue";
import CompanyCreateDialog from "@/components/company/CompanyCreateDialog.vue";
import ContactListDialog from "@/components/contact/ContactListDialog.vue";
import EmployeeCreateDialog from "@/components/employee/EmployeeCreateDialog.vue";
import {onMounted} from "vue";
import {useStore} from "vuex";

const store = useStore();

onMounted(() => {
  store.dispatch("fetchCustomers");
});

</script>
