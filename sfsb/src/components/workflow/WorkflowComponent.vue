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
            @task-can-move="onTaskCanMove"
            @edge-move="onMoveEdgeOfTask"
        )
</template>

<script setup lang="ts">
import ResourceComponent from "@/components/workflow/ResourceComponent.vue";
import { getCurrentInstance, provide, ref } from "vue";
import { useWorkflowStore } from "@/pinia-store/workflow";

const { proxy } = getCurrentInstance();
const MIN_TIMELINE_PX = proxy.$MIN_TIMELINE_PX;
const MIN_TIMELINE = proxy.$MIN_TIMELINE;

const resourcesRefs = ref([]);
const clean = ref(false);
const targetResourceId = ref<number | undefined>();

const { resources, taskWillMoveData, moveTask, onMoveEdgeOfTask } =
    useWorkflowStore();

const doClean = (resourceId: number) => {
    return targetResourceId.value === resourceId && clean.value;
};

const onDropEvent = (cellId: number) => {
    console.log("onDropEvent workwlow", taskWillMoveData);
    const { taskCanMove } = taskWillMoveData;
    if (taskCanMove) moveTask(cellId);
};
provide("onDropEvent", onDropEvent);

const onTaskWillMove = (
    data: (TaskWillMoveData & { resourceId: number }) | null
) => {
    clean.value = !data;
    setTimeout(() => {
        taskWillMoveData.taskId = !data ? null : data.taskId;
        taskWillMoveData.totalCell = !data ? null : data.totalCell;
        taskWillMoveData.cell = !data ? null : data.cell;
        taskWillMoveData.resourceId = !data ? null : data.resourceId;
        console.log("workflow", data);
    });
};

const onAlignTask = (id: number) => {
    if (targetResourceId.value === id) return;
    targetResourceId.value = id;
    taskWillMoveData.targetResourceId = id;
};

const onTaskCanMove = (value: boolean) => {
    taskWillMoveData.taskCanMove = value;
};
</script>

<style scoped lang="sass"></style>
