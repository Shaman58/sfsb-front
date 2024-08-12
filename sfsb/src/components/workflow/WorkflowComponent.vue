<template lang="pug">
    .workflow-component
        resource-component(
            v-for="resource in resources"
            :key="resource.id"
            ref="resourceRef"
            :resource
            @task-will-move="onTaskWillMove"
        )
</template>

<script setup lang="ts">
import ResourceComponent from "@/components/workflow/ResourceComponent.vue";
import { fakeResources } from "./fakeResources";
import { provide, reactive, ref } from "vue";

const resources = fakeResources;
const resourcesRefs = ref([]);

const taskWillMoveData = reactive<TaskWillMoveData>({} as TaskWillMoveData);
provide("taskWillMoveData", taskWillMoveData);

const onTaskWillMove = (data: TaskWillMoveData) => {
    taskWillMoveData.taskId = data.taskId;
    taskWillMoveData.totalCell = data.totalCell;
    taskWillMoveData.cell = data.cell;
    console.log("workflow", data);
};
</script>

<style scoped lang="sass"></style>
