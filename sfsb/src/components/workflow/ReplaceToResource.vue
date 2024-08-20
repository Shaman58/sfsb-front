<template lang="pug">
    v-select(
        v-model="resourceId"
        :items="resources"
        item-value="id"
        item-title="name"
    )
</template>
<script setup lang="ts">
import { useWorkflowStore } from "@/pinia-store/workflow";
import { ref, watch } from "vue";

const props = defineProps<{ resourceId: number | undefined }>();
const resourceId = ref(props.resourceId);
const emit = defineEmits(["change"]);

const { resources } = useWorkflowStore();
watch([resourceId], () => emit("change", resourceId.value));
</script>

<style scoped lang="sass"></style>
