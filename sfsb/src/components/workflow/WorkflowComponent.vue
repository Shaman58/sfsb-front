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
            @edge-move="moveEdgeOfTask"
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

const findResourceByTaskId = (id: number) => {
    const resource = resources.find((resource) =>
        resource.tasks.find((task: Task) => task.id === id)
    );
    if (!resource) return;
    return resource;
};

const findResourceIndex = (id: number) => {
    return resources.findIndex((resource) => resource.id === id);
};

const findtask = (id: number): Task | undefined => {
    const resource = findResourceByTaskId(id);
    if (!resource) return;
    const task = resource?.tasks.find((task: Task) => task.id === id);
    if (!task) return;
    return task;
};
const findTaskIndex = (id: number) => {
    const resource = findResourceByTaskId(id);
    if (!resource) return;
    return resource.tasks.findIndex((task) => task.id === id);
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
    let targetResource = targetResourceId && findResource(targetResourceId);
    const sourceResource = findResource(resourceId);
    if (!sourceResource) return;
    if (!targetResource) targetResource = sourceResource;
    if (!targetResource) return;

    const foundTask = findtask(taskId);
    if (!foundTask) return;

    const task: Task = { ...foundTask };

    //вычисляем новые координаты таски
    const startCellId = cellId + 1 - cell || 0;
    const endCellId = startCellId + totalCell - 1;

    const startTime = getTimeByCellId(startCellId, targetResource).startAt;
    const endTime = getTimeByCellId(endCellId, targetResource).endAt;

    if (!("id" in targetResource)) return;
    const foundResourceId = resources.findIndex(
        (r) => r.id === (targetResource as Resource).id
    );

    const foundTaskIndex = resources[foundResourceId].tasks.findIndex(
        (t) => t.id === taskId
    );

    //устанвливаем новые начало и конец таски
    task.startAt = startTime;
    task.endAt = endTime;

    //перемещаем таску на другой ресурс если требуется
    if (!!targetResourceId && targetResourceId !== resourceId) {
        if (!targetResource || !task) return;
        targetResource.tasks = [...targetResource.tasks, task]; //добавляем таску на новый ресурс

        const sourceResource = resources.find((r) => r.id === resourceId);
        if (!sourceResource) return;
        const taskIndex = sourceResource.tasks.findIndex(
            (t) => t.id === task.id
        );
        taskIndex !== -1 && sourceResource.tasks.splice(taskIndex, 1); //удаляем таску из ресурса
        return;
    }
    targetResource &&
        (targetResource.tasks[foundTaskIndex].startAt = task.startAt);
    targetResource && (targetResource.tasks[foundTaskIndex].endAt = task.endAt); //устанавливаем новые начало и конец таски
};

const moveEdgeOfTask = (
    taskId: number,
    edge: "left" | "right",
    direction: "left" | "right"
) => {
    const task = findtask(taskId);
    if (!task) return;
    const property = edge === "left" ? "startAt" : "endAt";
    const sign = direction === "left" ? -1 : 1;

    task[property] = new Date(
        new Date(task[property]).getTime() + sign * MIN_TIMELINE
    ).toString();

    const resource = findResourceByTaskId(taskId);
    const resourceIndex = findResourceIndex(resource.id);
    const taskIndex = findTaskIndex(taskId);

    resources[resourceIndex].tasks[taskIndex] = task;
};
</script>

<style scoped lang="sass"></style>
