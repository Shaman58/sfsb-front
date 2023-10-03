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
    <material-component/>
    <cutter-component/>
    <special-component/>
    <tooling-component/>
    <operation-component/>
  </v-container>
</template>

<script setup>

import DepartmentComponent from "@/components/department/DepartmentComponent.vue";
import CompanyComponent from "@/components/company/CompanyComponent.vue";
import MaterialComponent from "@/components/material/MaterialComponent.vue";
import CutterComponent from "@/components/cutter/CutterComponent.vue";
import SpecialComponent from "@/components/special/SpecialComponent.vue";
import ToolingComponent from "@/components/tooling/ToolingComponent.vue";
import OperationComponent from "@/components/operation/OperationComponent.vue";

</script>
