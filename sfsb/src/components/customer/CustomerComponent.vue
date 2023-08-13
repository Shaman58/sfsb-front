<template>
  <customer-preview-card/>
  <customer-list-dialog/>
  <company-create-dialog/>
  <contact-list-dialog/>
  <employee-create-dialog/>
</template>

<script>
import CustomerPreviewCard from "@/components/customer/CustomerPreviewCard.vue";
import CustomerListDialog from "@/components/customer/CustomerListDialog.vue";
import CompanyCreateDialog from "@/components/company/CompanyCreateDialog.vue";
import ContactListDialog from "@/components/contact/ContactListDialog.vue";
import EmployeeCreateDialog from "@/components/employee/EmployeeCreateDialog.vue";

export default {
  name: "customer-component",
  components: {
    EmployeeCreateDialog,
    ContactListDialog,
    CompanyCreateDialog,
    CustomerListDialog,
    CustomerPreviewCard
  },
  mounted() {
    this.$store.dispatch("fetchCustomersData");
  }
}
</script>
