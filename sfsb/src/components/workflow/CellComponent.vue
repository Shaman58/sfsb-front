<template lang="pug">
    .cell-component(@dragover.prevent="onDragover" @dragleave.prevent="dragover=false" @drop.prevent="onDrop" )
        pre {{props.id}} {{taskId}}
</template>

<script setup lang="ts">
import { computed, type Ref, ref } from "vue";

const props = defineProps<{ id: number }>();
const taskId: Ref<number | null> = ref(null);
const dragover = ref(false);
const color = computed(() => (dragover.value ? "red" : "init"));

const emit = defineEmits(["taskHasDrop", "taskOver"]);

const getTaskId = () => taskId.value;
const setTaskId = (id: number | null) => {
    return new Promise((resolve, reject) => {
        if (taskId.value !== null && id !== taskId.value)
            reject(`Task ID = ${id} in ${props.id} already exists`);
        taskId.value = id;
        resolve();
    });
};
const clear = () => {
    taskId.value = null;
};

const onDragover = (e: DragEvent) => {
    dragover.value = true;
    emit("taskOver", props.id);
    console.log("cell dragover", e);
};
const onDrop = (e: DragEvent) => {
    dragover.value = false;
    emit("taskHasDrop", props.id);
};

defineExpose({
    setTaskId,
    clear,
    getTaskId,
});
</script>

<style scoped lang="sass">
.cell-component
    display: grid
    place-items: center
    border-radius: 5px
    border: 1px solid #7777
    font-size: 10px
    background-color: v-bind(color)
</style>
