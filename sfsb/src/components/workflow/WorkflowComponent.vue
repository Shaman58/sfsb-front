<template lang="pug">
    .workflow-component
        resource-component(v-for="resource in resources" :key="resource.id")
</template>

<script setup lang="ts">
import ResourceComponent from "@/components/workflow/ResourceComponent.vue";
import { fakeResources } from "./fakeResources";

const resources = fakeResources;
</script>

<style scoped lang="sass"></style>
