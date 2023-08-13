<template>
  <v-container>
    <company-preview-card/>
    <company-create-dialog/>
  </v-container>
</template>

<script>
import CompanyPreviewCard from "@/components/company/CompanyPreviewCard.vue";
import CompanyCreateDialog from "@/components/company/CompanyCreateDialog.vue";

export default {
  name: "company-component",
  components: {CompanyCreateDialog, CompanyPreviewCard},
  mounted() {
    this.$store.dispatch("fetchCompanyData");
    this.$store.dispatch("fetchEmployees")
  }
}
</script>
