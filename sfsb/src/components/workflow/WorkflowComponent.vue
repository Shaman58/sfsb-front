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
import { getCurrentInstance, provide, reactive, ref } from "vue";
import { useWorkflowStore } from "@/pinia-store/workflow";

const { proxy } = getCurrentInstance();
const MIN_TIMELINE_PX = proxy.$MIN_TIMELINE_PX;
const MIN_TIMELINE = proxy.$MIN_TIMELINE;

// const resources = reactive(fakeResources);
const resourcesRefs = ref([]);
const clean = ref(false);
const targetResourceId = ref<number | undefined>();

const { resources, find, changeTask } = useWorkflowStore();

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

//TODO: перенести в pinia
const moveTask = (cellId: number) => {
    console.log("pre resources", resources);
    const { taskId, totalCell, cell, targetResourceId, resourceId } =
        taskWillMoveData;

    if (!taskId || !resourceId) return; //TODO: возможно exception или сообщение
    let targetResource =
        targetResourceId && find.findResource.byId(targetResourceId);
    const sourceResource = find.findResource.byId(resourceId);
    if (!sourceResource) return;
    if (!targetResource) targetResource = sourceResource;
    if (!targetResource) return;

    const foundTask = find.findTask.byId(taskId);
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

//TODO: перенести в pinia
const onMoveEdgeOfTask = (
    taskId: number,
    edge: "left" | "right",
    direction: "left" | "right"
) => {
    const task = find.findTask.byId(taskId);
    if (!task) return;
    const property = edge === "left" ? "startAt" : "endAt";
    const sign = direction === "left" ? -1 : 1;

    const newDate = new Date(
        new Date(task[property]).getTime() + sign * MIN_TIMELINE
    ).toISOString();
    task[property] = newDate;

    const resource = find.findResource.byTaskId(taskId);
    const resourceIndex = find.findResource.index(resource.id);
    const taskIndex = find.findTask.index(taskId);

    resources[resourceIndex].tasks[taskIndex] = task;
};
</script>

<style scoped lang="sass"></style>
