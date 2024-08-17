<template lang="pug">
    .workflow-component
        resource-component(
            v-for="resource in resources"
            :key="resource.id"
            :resource
        )
</template>

<script setup lang="ts">
import ResourceComponent from "@/components/workflow/ResourceComponent.vue";
import { useWorkflowStore } from "@/pinia-store/workflow";

const { resources } = useWorkflowStore();
</script>

<style scoped lang="sass">
.workflow-component
    margin-top: 2rem
</style>
