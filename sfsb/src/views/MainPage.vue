<template>
  <br>
  <v-container>
    <v-row>
      <v-col cols="6">
        <company-component/>
      </v-col>
      <v-col cols="6">
        <employee-component/>
      </v-col>
    </v-row>
    <v-card class="center-card">
      <material-component/>
      <cutter-component/>
      <special-component/>
      <tooling-component/>
      <operation-component/>
    </v-card>
  </v-container>
</template>

<script setup>
import CompanyComponent from "@/components/company/CompanyComponent.vue";
import MaterialComponent from "@/components/material/MaterialComponent.vue";
import CutterComponent from "@/components/tool/CutterComponent.vue";
import SpecialComponent from "@/components/tool/SpecialComponent.vue";
import ToolingComponent from "@/components/tool/ToolingComponent.vue";
import OperationComponent from "@/components/operation/OperationComponent.vue";
import EmployeeComponent from "@/components/employee/EmployeeComponent.vue";
</script>

<style scoped>
.center-card {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
