<template lang="pug">
    v-select.resources(
        v-model="resourceId"
        :items="resources"
        label="Ресурсы"
        item-value="id"
        item-title="name"
    )
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useWorkflow } from "@/pinia-store/workflow";

const resourceId = defineModel("resourceId", { required: true });
const { resources } = storeToRefs(useWorkflow());
</script>

<style scoped lang="sass">
.resources
    margin-top: 1rem
</style>
