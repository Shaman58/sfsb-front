<template lang="pug">
    .workflow-component
        resource-component(
            v-for="resource in resources"
            :key="resource.id"
            ref="resourceRef"
            :resource
            :clean
            @task-will-move="onTaskWillMove"
        )
</template>

<script setup lang="ts">
import ResourceComponent from "@/components/workflow/ResourceComponent.vue";
import { fakeResources } from "./fakeResources";
import { provide, reactive, ref } from "vue";

const resources = fakeResources;
const resourcesRefs = ref([]);
const clean = ref(false);

const taskWillMoveData = reactive<TaskWillMoveData>({} as TaskWillMoveData);
provide("taskWillMoveData", taskWillMoveData);

const onTaskWillMove = (data: TaskWillMoveData | null) => {
    if (!data) {
        clean.value = true;
    } else {
        clean.value = false;
    }
    taskWillMoveData.taskId = !data ? null : data.taskId;
    taskWillMoveData.totalCell = !data ? null : data.totalCell;
    taskWillMoveData.cell = !data ? null : data.cell;
    console.log("workflow", data);
};
</script>

<style scoped lang="sass"></style>
