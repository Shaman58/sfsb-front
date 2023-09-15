<template>
  <v-container>
    <company-preview-card/>
    <company-create-dialog/>
  </v-container>
</template>

<script setup>
import CompanyPreviewCard from "@/components/company/CompanyPreviewCard.vue";
import CompanyCreateDialog from "@/components/company/CompanyCreateDialog.vue";
import {onMounted} from "vue";
import {useStore} from "vuex";

const store = useStore();

onMounted(() => {
  store.dispatch("fetchCompanyData");
  store.dispatch("fetchEmployees")
});

</script>
