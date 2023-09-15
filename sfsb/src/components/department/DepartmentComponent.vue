<template>
  <v-container>
    <department-preview-card/>
    <department-list-dialog/>
    <department-create-dialog/>
  </v-container>
</template>

<script setup>
import DepartmentPreviewCard from "@/components/department/DepartmentPreviewCard.vue";
import DepartmentListDialog from "@/components/department/DepartmentListDialog.vue";
import DepartmentCreateDialog from "@/components/department/DepartmentCreateDialog.vue";
import {onMounted} from "vue";
import {useStore} from "vuex";

const store = useStore();

onMounted(() => {
  store.dispatch('fetchAllDepartmentData')
});

</script>
