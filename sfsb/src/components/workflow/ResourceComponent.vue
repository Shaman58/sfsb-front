<template lang="pug">
    .resource(@dragover.prevent="dragover" @drop.prevent="drop" @dragenter.prevent="dragenter" @dragleave.prevent="dragleave" @dragover.)
        .task-shadow(
            ref="taskShadow"
            :style="{width: durationTrackingTask + 'px', left: dragOverPosition+'px', backgroundColor: isIntersected? 'orange':'#77f5'}"
        )
        task-component(v-for="task in tasks" :key="task.id"  :task ref="taskRefs")
</template>

<script setup lang="ts">
import TaskComponent from "@/components/workflow/TaskComponent.vue";
import { computed, inject, reactive, ref } from "vue";
import { storeToRefs } from "pinia";
import useTaskMoving from "@/pinia-store/taskMoving";
import {
    areElementsOverlapping,
    coordinatesToTime,
} from "@/mixins/coordinatesAndTime";

const props = defineProps<{ resource: Resource }>();

const tasks = reactive(props.resource.tasks);
const taskRefs = ref<TaskComponent[]>();

const scale = inject("scale");

const { taskMoving } = storeToRefs(useTaskMoving());
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
    e.preventDefault();
    if (dragOverPosition.value === e.x) return;
    dragOverPosition.value = e.x - taskMoving.value?.offsetX;
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
    const droppedTask: Task & { offsetX: number } = JSON.parse(
        e.dataTransfer?.getData("task")
    );
    console.log("drop", e, droppedTask);

    let matchTaskIndex = tasks.findIndex((e) => e.id === droppedTask.id);
    if (matchTaskIndex === undefined) return;

    const newStartDate = coordinatesToTime(
        e.x - droppedTask.offsetX,
        scale.value
    );
    const newEndDate = coordinatesToTime(
        e.x - droppedTask.offsetX + durationTrackingTask.value,
        scale.value
    );
    tasks[matchTaskIndex].startAt = newStartDate;
    tasks[matchTaskIndex].endAt = newEndDate;
};
const dragenter = () => {};
const dragleave = () => {};
</script>

<style scoped lang="sass">
.resource
    position: relative
    height: 60px
    width: 100%
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
