<template>
  <v-container>
    <department-preview-card/>
    <department-list-dialog/>
    <department-create-dialog/>
  </v-container>
</template>

<script>
import DepartmentPreviewCard from "@/components/department/DepartmentPreviewCard.vue";
import DepartmentListDialog from "@/components/department/DepartmentListDialog.vue";
import DepartmentCreateDialog from "@/components/department/DepartmentCreateDialog.vue";

export default {
  name: "department-component",
  components: {DepartmentCreateDialog, DepartmentListDialog, DepartmentPreviewCard},
  mounted() {
    this.$store.dispatch('fetchAllDepartmentData')
  }
}
</script>
