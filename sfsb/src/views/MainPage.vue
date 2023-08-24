<template>
  <br>
  <v-container>
    <v-row>
      <v-col cols="6">
        <company-component/>
      </v-col>
      <v-col cols="6">
        <department-component/>
      </v-col>
    </v-row>
  </v-container>
  <area-component/>
</template>

<script>

import DepartmentComponent from "@/components/department/DepartmentComponent.vue";
import CompanyComponent from "@/components/company/CompanyComponent.vue";
import AreaComponent from "@/components/area/AreaComponent.vue";
import MaterialComponent from "@/components/material/MaterialComponent.vue";

export default {
  name: "main-page",
  components: {MaterialComponent, CompanyComponent, DepartmentComponent, AreaComponent}
}
</script>
