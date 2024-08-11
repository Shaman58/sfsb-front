<template lang="pug">
    .workflow-component
        resource-component(v-for="resource in resources" :key="resource.id" ref="resourceRef" :resource)
</template>

<script setup lang="ts">
import ResourceComponent from "@/components/workflow/ResourceComponent.vue";
import { fakeResources } from "./fakeResources";
import { ref } from "vue";

const resources = fakeResources;
const resourcesRefs = ref([]);
</script>

<style scoped lang="sass"></style>
