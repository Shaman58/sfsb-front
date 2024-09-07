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
            ref="taskShadow"
            :style="{width: durationTrackingTask + 'px', left: dragOverPosition+'px', backgroundColor: isIntersected? 'orange':'#77f5'}"
        )
        task-component(v-for="task in tasks" :key="task.id"  :task ref="taskRefs")
</template>

<script setup lang="ts">
import TaskComponent from "@/components/workflow/TaskComponent.vue";
import { computed, inject, reactive, ref, watch } from "vue";
import { storeToRefs } from "pinia";
import useTaskMoving from "@/pinia-store/taskMoving";
import {
    areElementsOverlapping,
    coordinatesToTime,
} from "@/mixins/coordinatesAndTime";
import { useToast } from "vue-toast-notification";

const toast = useToast();
const props = defineProps<{ resource: Resource }>();

const tasks = reactive(props.resource.tasks);
const taskRefs = ref<TaskComponent[]>();
const resourceRef = ref<HTMLElement>();

const scale = inject("scale");

const { taskMoving, borderMoving, scrollBody } = storeToRefs(useTaskMoving());
const taskShadow = ref<HTMLDivElement>();
const isIntersected = ref(false);
const tracking = computed(() => taskMoving.value);
const durationTrackingTask = computed(() => {
    if (!taskMoving.value) return 0;
    return (
        ((new Date(taskMoving.value.endAt).getTime() -
            new Date(taskMoving.value.startAt).getTime()) /
            (3600 * 1000)) *
        scale!.value
    );
});
const dragOverPosition = ref(0);

const dragover = (e: DragEvent) => {
    console.log("dragover", scrollBody.value);
    if (dragOverPosition.value === e.x + scrollBody.value) return;
    dragOverPosition.value = e.x + scrollBody.value - taskMoving.value?.offsetX;
    if (!taskShadow.value) return;
    isIntersected.value = taskRefs.value?.some((e) => {
        if (e.id === taskMoving.value?.id) return false;
        return areElementsOverlapping(
            taskShadow.value as HTMLElement,
            e.element
        );
    });
    console.log("areElementsOverlapping", isIntersected);
};
const drop = (e: DragEvent) => {
    if (isIntersected.value)
        return toast.error("Это время занято другой задачей");
    const droppedTask: Task & { offsetX: number } = JSON.parse(
        e.dataTransfer?.getData("task")
    );
    console.log("drop", e, droppedTask);

    let matchTaskIndex = tasks.findIndex((e) => e.id === droppedTask.id);
    if (matchTaskIndex === undefined) return;

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
    tasks[matchTaskIndex].startAt = newStartDate;
    tasks[matchTaskIndex].endAt = newEndDate;
};
const dragenter = () => {};
const dragleave = () => {};
const mouseup = () => {
    borderMoving.value = null;
};
const mousemove = (e: MouseEvent) => {
    const { x } = e;
    if (!borderMoving.value) return;
    const time = coordinatesToTime(x, scale.value);
    const taskIndex = tasks.findIndex((e) => e.id === borderMoving.value?.id);
    console.log({ taskIndex });
    if (taskIndex === -1) return;

    if (borderMoving.value.border === "left") tasks[taskIndex].startAt = time;
    if (borderMoving.value.border === "right") tasks[taskIndex].endAt = time;
};

watch([borderMoving], () => {
    console.log("borderMoving", borderMoving.value);
});
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
    background-color: #77f5
    position: absolute
    top: 0
    left: 0
</style>
