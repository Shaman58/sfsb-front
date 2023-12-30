<template>
    <br>
    <v-container>

        <v-card class="center-card">
            <material-component />
            <cutter-component />
            <special-component />
            <tooling-component />
            <operation-component />
        </v-card>
    </v-container>
</template>

<script setup lang="ts">
import MaterialComponent from "@/components/material/MaterialComponent.vue";
import CutterComponent from "@/components/tool/CutterComponent.vue";
import SpecialComponent from "@/components/tool/SpecialComponent.vue";
import ToolingComponent from "@/components/tool/ToolingComponent.vue";
import OperationComponent from "@/components/operation/OperationComponent.vue";
</script>

<style scoped>
.center-card {
    display: flex;
    flex-direction: column;
    align-items: center;
}
</style>
