<template lang="pug">
    div {{refresh ? "-" : "--"}}
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
        )
</template>

<script setup lang="ts">
import ResourceComponent from "@/components/workflow/ResourceComponent.vue";
import { fakeResources } from "./fakeResources";
import { getCurrentInstance, provide, reactive, ref } from "vue";

const { proxy } = getCurrentInstance();
const MIN_TIMELINE_PX = proxy.$MIN_TIMELINE_PX;
const MIN_TIMELINE = proxy.$MIN_TIMELINE;

const resources = reactive(fakeResources);
const resourcesRefs = ref([]);
const clean = ref(false);
const targetResourceId = ref<number | undefined>();
const refresh = ref(false); //для пренудительной перерисовки

const doClean = (resourceId: number) => {
    return targetResourceId.value === resourceId && clean.value;
};

const taskWillMoveData = reactive<ExtendedTaskWillMoveData>(
    {} as ExtendedTaskWillMoveData
);
provide("taskWillMoveData", taskWillMoveData);

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
const findResource = (id: number): Resource | undefined => {
    return resources.find((resource) => resource.id === id);
};

const findtask = (id: number): Task | undefined => {
    const resource = resources.find((resource) =>
        resource.tasks.find((task: Task) => task.id === id)
    );
    if (!resource) return;
    const task = resource?.tasks.find((task: Task) => task.id === id);
    if (!task) return;
    return task;
};

const getTimeByCellId = (id: number, resource: Resource) => {
    const resourceStartAt = resource.startAt;
    return {
        startAt: new Date(
            new Date(resourceStartAt).getTime() +
                new Date(id * MIN_TIMELINE).getTime()
        ).toISOString(),
        endAt: new Date(
            new Date(resourceStartAt).getTime() +
                new Date((id + 1) * MIN_TIMELINE).getTime()
        ).toISOString(),
    };
};

const moveTask = (cellId: number) => {
    console.log("pre resources", resources);
    const { taskId, totalCell, cell, targetResourceId, resourceId } =
        taskWillMoveData;

    if (!taskId || !resourceId) return; //TODO: возможно exception или сообщение
    const resource = findResource(targetResourceId || resourceId);
    if (!resource) return;

    const task = findtask(taskId);
    const startCellId = cellId - cell || 0;
    const endCellId = startCellId + totalCell;

    const startTime = getTimeByCellId(startCellId, resource).startAt;
    const endTime = getTimeByCellId(endCellId, resource).endAt;

    const foundResourceId = resources.findIndex((r) => r.id === resource.id);
    const foundTaskId = resources[foundResourceId].tasks.findIndex(
        (t) => t.id === taskId
    );

    console.log(
        "before resources",
        resources[foundResourceId].tasks[foundTaskId].startAt,
        resources[foundResourceId].tasks[foundTaskId].endAt
    );
    resources[foundResourceId].tasks[foundTaskId] = {
        ...resources[foundResourceId].tasks[foundTaskId],
        startAt: startTime,
        endAt: endTime,
    };
    // resources[foundResourceId].tasks[foundTaskId].startAt = startTime;
    // resources[foundResourceId].tasks[foundTaskId].endAt = endTime;
    console.log(
        "before resources",
        resources[foundResourceId].tasks[foundTaskId].startAt,
        resources[foundResourceId].tasks[foundTaskId].endAt
    );
};
</script>

<style scoped lang="sass"></style>
