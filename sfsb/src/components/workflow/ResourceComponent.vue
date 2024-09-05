<template lang="pug">
    .resource(@dragover.prevent="dragover" @drop.prevent="drop" @dragenter.prevent="dragenter" @dragleave.prevent="dragleave" @dragover.)
        .task-shadow( ref="taskShadow" :style="{width: durationTrackingTask + 'px', left: dragOverPosition+'px'}")
        task-component(v-for="task in tasks" :key="task.id"  :task ref="taskRefs")
</template>

<script setup lang="ts">
import TaskComponent from "@/components/workflow/TaskComponent.vue";
import { computed, inject, reactive, ref } from "vue";
import { storeToRefs } from "pinia";
import useTaskMoving from "@/pinia-store/taskMoving";

const props = defineProps<{ resource: Resource }>();

const tasks = reactive(props.resource.tasks);
const taskRefs = ref<TaskComponent[]>();

const scale = inject("scale");

const { taskMoving } = storeToRefs(useTaskMoving());
const taskShadow = ref<HTMLDivElement>();
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
    taskShadow.value &&
        console.log(
            dragOverPosition.value,
            taskShadow.value?.getBoundingClientRect().x
        );
    console.log(
        taskRefs.value?.map((e) => e.element.getBoundingClientRect().x)
    );
};
const drop = (e: DragEvent) => {
    const droppedTask: Task & { offsetX: number } = JSON.parse(
        e.dataTransfer?.getData("task")
    );
    console.log("drop", e, droppedTask);

    const timezoneOffsetMs = new Date().getTimezoneOffset() * 60 * 1000;
    const initStartAtMs = new Date("09.02.2024").getTime() - timezoneOffsetMs;
    const initDate = new Date(initStartAtMs).toISOString();
    console.log(initDate);

    const offsetTimeMs = (e.x / scale.value) * (3600 * 1000);
    const pointerOffsetMs = (droppedTask.offsetX / scale.value) * (3600 * 1000);

    const durationMs =
        new Date(droppedTask.endAt).getTime() -
        new Date(droppedTask.startAt).getTime();
    droppedTask.startAt = new Date(
        -pointerOffsetMs + offsetTimeMs + initStartAtMs + timezoneOffsetMs
    ).toISOString();
    droppedTask.endAt = new Date(
        -pointerOffsetMs +
            offsetTimeMs +
            initStartAtMs +
            durationMs +
            timezoneOffsetMs
    ).toISOString();

    let matchTaskIndex = tasks.findIndex((e) => e.id === droppedTask.id);
    if (matchTaskIndex === undefined) return;
    tasks[matchTaskIndex].startAt = droppedTask.startAt;
    tasks[matchTaskIndex].endAt = droppedTask.endAt;
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
    transition: left 0.2s
</style>
