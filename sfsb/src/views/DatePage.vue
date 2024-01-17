<template lang="pug">
    br
    v-container

        v-card.center-card
            material-component
            cutter-component
            special-component
            suspended-component
                tooling-component
</template>

<script setup lang="ts">
import MaterialComponent from "@/components/material/MaterialComponent.vue";
import CutterComponent from "@/components/tool/CutterComponent.vue";
import SpecialComponent from "@/components/tool/SpecialComponent.vue";
import ToolingComponent from "@/components/tool/ToolingComponent.vue";
import SuspendedComponent from "@/components/common/SuspendedComponent.vue";
</script>

<style scoped>
.center-card {
    display: flex;
    flex-direction: column;
    align-items: center;
}
</style>
