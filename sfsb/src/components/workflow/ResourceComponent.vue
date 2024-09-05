<template lang="pug">
    .resource(@dragover.prevent="dragover" @drop.prevent="drop" @dragenter.prevent="dragenter" @dragleave.prevent="dragleave")
        task-component(v-for="task in tasks" :key="task.id"  :task)
</template>

<script setup lang="ts">
import TaskComponent from "@/components/workflow/TaskComponent.vue";
import { inject, reactive } from "vue";

const props = defineProps<{ resource: Resource }>();

const tasks = reactive(props.resource.tasks);

const scale = inject("scale");

const dragover = () => {};
const drop = (e: DragEvent) => {
    const dropedTask: Task & { offsetX: number } = JSON.parse(
        e.dataTransfer?.getData("task")
    );
    console.log("drop", e, dropedTask);

    const timezoneOffsetMs = new Date().getTimezoneOffset() * 60 * 1000;
    const initStartAtMs = new Date("09.02.2024").getTime() - timezoneOffsetMs;
    const initDate = new Date(initStartAtMs).toISOString();
    console.log(initDate);

    const offsetTimeMs = (e.offsetX / scale.value) * (3600 * 1000);
    const pointerOffsetMs = (dropedTask.offsetX / scale.value) * (3600 * 1000);

    const durationMs =
        new Date(dropedTask.endAt).getTime() -
        new Date(dropedTask.startAt).getTime();
    dropedTask.startAt = new Date(
        -pointerOffsetMs + offsetTimeMs + initStartAtMs + timezoneOffsetMs
    ).toISOString();
    dropedTask.endAt = new Date(
        -pointerOffsetMs +
            offsetTimeMs +
            initStartAtMs +
            durationMs +
            timezoneOffsetMs
    ).toISOString();

    let matchTaskIndex = tasks.findIndex((e) => e.id === dropedTask.id);
    tasks[matchTaskIndex].startAt = dropedTask.startAt;
    tasks[matchTaskIndex].endAt = dropedTask.endAt;

    //TODO: скорректировать точку указателя мышки при перетаскивании
};
const dragenter = () => {};
const dragenterOff = () => {};
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
</style>
