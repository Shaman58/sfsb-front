<template lang="pug">
    .resource(
        ref="resourceRef"
        @dragover.prevent="dragover"
        @drop.prevent="drop"
        @dragenter.prevent="dragenter"
        @dragleave.prevent="dragleave"
        @mouseup.prevent="mouseup"
        @mousemove.prevent="mousemove"
    )
        .task-shadow(
            :class="{'over': doMove}"
            ref="taskShadow"
            :style="{width: durationTrackingTask + 'px', left: dragOverPosition+'px', backgroundColor: isIntersected? 'orange':''}"
        )
        task-component(v-for="task in tasks" :key="task.id"  :task ref="taskRefs" :active="task.id===taskMoving?.id")
</template>

<script setup lang="ts">
import TaskComponent from "@/components/workflow/TaskComponent.vue";
import { computed, inject, ref, watch } from "vue";
import { storeToRefs } from "pinia";
import useTaskMoving from "@/pinia-store/taskMoving";
import {
    areElementsOverlapping,
    coordinatesToTime,
} from "@/mixins/coordinatesAndTime";
import { useToast } from "vue-toast-notification";
import { useWorkflow } from "@/pinia-store/workflow";

const toast = useToast();
const props = defineProps<{ resource: Resource }>();

const tasks = ref(props.resource.tasks);
const taskRefs = ref<TaskComponent[]>();
const resourceRef = ref<HTMLElement>();

const scale = inject("scale");
const doMove = ref(false);

const { taskMoving, borderMoving, scrollBody } = storeToRefs(useTaskMoving());
const { relocateTask } = useWorkflow();

const taskShadow = ref<HTMLDivElement>();
const isIntersected = ref(false);
const tracking = computed(() => taskMoving.value);
const durationTrackingTask = computed(() => {
    if (!taskMoving.value && !borderMoving.value) return 0;
    if (tracking.value) {
        return (
            ((new Date(taskMoving.value.endAt).getTime() -
                new Date(taskMoving.value.startAt).getTime()) /
                (3600 * 1000)) *
            scale!.value
        );
    }
    if (borderMoving.value) {
        return (
            ((new Date(borderMoving.value.endAt).getTime() -
                new Date(borderMoving.value.startAt).getTime()) /
                (3600 * 1000)) *
            scale!.value
        );
    }
    return 0;
});
const dragOverPosition = ref(0);

const refineIsIntersected = () => {
    isIntersected.value = taskRefs.value?.some((e) => {
        if (e.id === taskMoving.value?.id || e.id === borderMoving.value?.id)
            return false;
        return areElementsOverlapping(
            taskShadow.value as HTMLElement,
            e.element
        );
    });
};

const dragover = (e: DragEvent) => {
    doMove.value = true;
    console.log("dragover", scrollBody.value);
    if (dragOverPosition.value === e.x + scrollBody.value) return;
    dragOverPosition.value = e.x + scrollBody.value - taskMoving.value?.offsetX;
    if (!taskShadow.value) return;
    refineIsIntersected();
    console.log("areElementsOverlapping", isIntersected);
};
const drop = (e: DragEvent) => {
    if (isIntersected.value)
        return toast.error("Это время занято другой задачей");
    const droppedTask: Task & { offsetX: number } = JSON.parse(
        e.dataTransfer?.getData("task")
    );
    console.log("drop", e, droppedTask);

    let matchTaskIndex = tasks.value.findIndex((e) => e.id === droppedTask.id);
    if (matchTaskIndex === -1) {
        matchTaskIndex = tasks.value.findIndex((e) => e.id === droppedTask.id);
        const newStartDate = coordinatesToTime(
            e.x + scrollBody.value - droppedTask.offsetX,
            scale.value
        );
        const newEndDate = coordinatesToTime(
            e.x +
                scrollBody.value -
                droppedTask.offsetX +
                durationTrackingTask.value,
            scale.value
        );
        // const newTask = tasks.value[matchTaskIndex];
        // newTask.startAt = newStartDate;
        // newTask.endAt = newEndDate;
        relocateTask(droppedTask.id, props.resource, {
            startAt: newStartDate,
            endAt: newEndDate,
        });
    } else {
        const newStartDate = coordinatesToTime(
            e.x + scrollBody.value - droppedTask.offsetX,
            scale.value
        );
        const newEndDate = coordinatesToTime(
            e.x +
                scrollBody.value -
                droppedTask.offsetX +
                durationTrackingTask.value,
            scale.value
        );
        tasks.value[matchTaskIndex].startAt = newStartDate;
        tasks.value[matchTaskIndex].endAt = newEndDate;
    }
};
const dragenter = () => {
    // doMove.value = true;
};
const dragleave = () => {
    doMove.value = false;
};
const mouseup = () => {
    borderMoving.value = null;
    doMove.value = false;
};
const mousemove = (e: MouseEvent) => {
    doMove.value = true;
    const { x } = e;
    if (!borderMoving.value) return;
    if (dragOverPosition.value === e.x + scrollBody.value) return;

    const prevTime =
        borderMoving.value.border === "left"
            ? borderMoving.value.startAt
            : borderMoving.value.endAt;
    const prevDragOverPosition = dragOverPosition.value;

    const time = coordinatesToTime(x, scale.value);
    const taskIndex = tasks.value.findIndex(
        (e) => e.id === borderMoving.value?.id
    );
    console.log(borderMoving.value.startAt, borderMoving.value.endAt);
    if (taskIndex === -1) return;

    if (borderMoving.value.border === "left") {
        tasks.value[taskIndex].startAt = time;
        borderMoving.value.startAt = time;
        dragOverPosition.value = e.x + scrollBody.value;
    }
    if (borderMoving.value.border === "right") {
        tasks.value[taskIndex].endAt = time;
        borderMoving.value.endAt = time;
        dragOverPosition.value =
            e.x + scrollBody.value - durationTrackingTask.value;
    }
    refineIsIntersected();
    if (isIntersected.value) {
        toast.error("Это время занято другой задачей");
        if (borderMoving.value.border === "left") {
            tasks.value[taskIndex].startAt = prevTime;
            borderMoving.value.startAt = prevTime;
            dragOverPosition.value = prevDragOverPosition;
        }
        if (borderMoving.value.border === "right") {
            tasks.value[taskIndex].endAt = prevTime;
            borderMoving.value.endAt = prevTime;
            dragOverPosition.value = prevDragOverPosition;
        }
    }
};

watch([borderMoving], () => {
    console.log("borderMoving", borderMoving.value);
});
watch([durationTrackingTask], () => {
    console.log("durationTrackingTask", durationTrackingTask.value);
});
watch(
    () => props.resource.tasks,
    (newTasks) => {
        tasks.value = newTasks;
    },
    { deep: true, immediate: true }
);
</script>

<style scoped lang="sass">
.resource
    position: relative
    height: 60px
    //width: 100cqw
    background-color: #fff2
    backdrop-filter: blur(2px)
    margin-block: 4px
    box-shadow: 8px 8px 18px #0003, 8px 8px 6px #fff6 inset

.task-shadow
    height: 100%
    opacity: 0.5
    position: absolute
    top: 0
    left: 0

    &.over
        background-color: #7777
</style>
