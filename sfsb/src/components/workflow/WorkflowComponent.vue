<template lang="pug">
    .workflow-component
        resource-component(
            v-for="resource in resources"
            :key="resource.id"
            ref="resourceRef"
            :resource
            :clean="doClean(resource.id)"
            @task-will-move="onTaskWillMove"
            @align-task="onAlignTask"
        )
</template>

<script setup lang="ts">
import ResourceComponent from "@/components/workflow/ResourceComponent.vue";
import { fakeResources } from "./fakeResources";
import { provide, reactive, ref } from "vue";

const resources = fakeResources;
const resourcesRefs = ref([]);
const clean = ref(false);
const targetResourceId = ref<number | undefined>();

const doClean = (resourceId: number) => {
    return targetResourceId.value === resourceId && clean.value;
};

const taskWillMoveData = reactive<
    TaskWillMoveData & { resourceId: number | null }
>(
    {} as TaskWillMoveData & {
        resourceId: number | null;
    }
);
provide("taskWillMoveData", taskWillMoveData);

const onTaskWillMove = (
    data: (TaskWillMoveData & { resourceId: number }) | null
) => {
    if (!data) {
        clean.value = true;
    } else {
        clean.value = false;
    }
    setTimeout(() => {
        taskWillMoveData.taskId = !data ? null : data.taskId;
        taskWillMoveData.totalCell = !data ? null : data.totalCell;
        taskWillMoveData.cell = !data ? null : data.cell;
        taskWillMoveData.resourceId = !data ? null : data.resourceId;
        console.log("workflow", data);
    });
};

const onAlignTask = (id: number) => {
    if (targetResourceId.value !== id) targetResourceId.value = id;
};
</script>

<style scoped lang="sass"></style>
