<template lang="pug">
    .cell-component(
        :style="{backgroundColor: color}"
        @dragover.prevent="events.onDragOver(id,resourceId)"
        @drop.prevent="onDrop"
        @mousemove="onMouseMove"
    )
        pre {{id}} {{taskId}} {{resourceId}}
</template>

<script setup lang="ts">
import { type Ref, ref, watch } from "vue";
import { useWorkflowStore } from "@/pinia-store/workflow";
import { storeToRefs } from "pinia";

const COLOR_QUERY = {
    disabled: "#ff0000",
    enabled: "#00ff00",
};

const props = defineProps<{ id: number; resourceId: number }>();
const taskId: Ref<number | null> = ref(null);
const dragover = ref(false);
const color = ref("");

const { signals, events } = useWorkflowStore();
const { sourceResourceId, targetResourceId } = storeToRefs(useWorkflowStore());

const getTaskId = () => {
    return taskId.value;
};
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

const onDragover = (e: DragEvent) => {};
const onDrop = (e: DragEvent) => {};

const setEnabledColor = () => {
    color.value = COLOR_QUERY.enabled;
};
const setDisabledColor = () => {
    color.value = COLOR_QUERY.disabled;
};
const clearColor = () => {
    color.value = "transparent";
};

const onMouseMove = (e: MouseEvent) => {};

watch(
    () => signals.activeCells,
    () => {
        if (
            signals.activeCells.find(
                ({ cellId, resourceId }) =>
                    cellId === props.id && resourceId === props.resourceId
            )
        ) {
            setEnabledColor();
        }
    }
);

watch([sourceResourceId], ([value], [oldValue]) => {
    if (
        (value === undefined && oldValue === props.resourceId) ||
        targetResourceId.value === props.resourceId
    ) {
        clearColor();
    }
});

defineExpose({
    setTaskId,
    clear,
    getTaskId,
    setEnabledColor,
    setDisabledColor,
    clearColor,
});
</script>

<style scoped lang="sass">
.cell-component
    display: grid
    place-items: center
    border-radius: 5px
    border: 1px solid #7777
    font-size: 10px
    //background-color: v-bind(color)
    transition: background-color .2s ease-in-out
</style>
