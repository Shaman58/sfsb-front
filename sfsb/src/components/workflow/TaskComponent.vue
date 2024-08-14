<template lang="pug">
    .task-component(:draggable @dragstart="onDragStart" @dragend="emit('taskBreakMove')" ref="taskElement")
        .task-component__edge.task-component__edge--left(
            @mouseup="emit('leftEdgeUp',task.id)"
            @mousedown="emit('leftEdgeDown', task.id)"
        )
        .task-component__main(:title="`${task.name} ${start} ${end} ${coordX} ${widthComponent}`") {{task.name}} {{start}} {{end}} {{coordX}} {{widthComponent}}
        .task-component__edge.task-component__edge--right(
            @mouseup="emit('rightEdgeUp', task.id)"
            @mousedown="emit('rightEdgeDown', task.id)"
        )
</template>

<script setup lang="ts">
import { computed, getCurrentInstance, ref } from "vue";

const { proxy } = getCurrentInstance();

const props = defineProps<{
    task: Task;
    start: number;
    end: number;
    draggable: boolean;
}>();
const emit = defineEmits([
    "leftEdgeDown",
    "rightEdgeDown",
    "leftEdgeUp",
    "rightEdgeUp",
    "taskWillMove",
    "taskBreakMove",
]);

const coordX = ref(0);
const taskElement = ref<HTMLDivElement>();
const widthComponent = computed(() => taskElement.value?.offsetWidth);
const totalCellInComponent = computed(
    () => widthComponent.value / parseInt(proxy.$MIN_TIMELINE_PX)
);

const inCell = (coord: number): number => {
    return Math.floor(coord / parseInt(proxy.$MIN_TIMELINE_PX)) + 1;
};

const onDragStart = (e: DragEvent) => {
    const { offsetX } = e;
    emit("taskWillMove", {
        taskId: props.task.id,
        totalCell: totalCellInComponent.value,
        cell: inCell(offsetX),
    });
};
</script>

<style scoped lang="sass">
.task-component
    translate: 0 -100%
    user-select: none
    grid-column: v-bind(start) / v-bind(end)
    grid-row: 2 / 3
    background-color: #00bcd4
    display: grid
    grid-template-columns: 8px 1fr 8px

    &__edge
        background-color: #00c853
        cursor: col-resize

    &__main
        overflow: hidden
</style>
