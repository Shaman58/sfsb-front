<template lang="pug">
    .task-component(:draggable @dragstart="onDragStart" @dragend="emit('taskBreakMove')" ref="taskElement")
        .task-component__edge.task-component__edge--left(
            @mouseup="emit('leftEdgeUp',task.id)"
            @mousedown="emit('leftEdgeDown', task.id)"
        )
        .task-component__main {{task.name}} {{start}} {{end}} {{coordX}} {{widthComponent}}
            v-tooltip(activator="parent" location="start")
                h3 {{task.name}}
                p {{task.description}}
                div Время начала:
                    date {{formatDateStartAt}}&nbsp;
                    time
                        strong {{formatTimeStartAt}}
                div Время завершения:
                    date {{formatDateEndAt}}&nbsp;
                    time
                        strong {{formatTimeEndAt}}
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

const formatDate = (date: string) => {
    const options: Intl.DateTimeFormatOptions = {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    };
    const res = new Intl.DateTimeFormat("ru-RU", options).format(
        new Date(date)
    );
    return res;
};
const formatTime = (date: string) => {
    const options: Intl.DateTimeFormatOptions = {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
    };
    const res = new Intl.DateTimeFormat("ru-RU", options).format(
        new Date(date)
    );
    return res;
};

const formatDateStartAt = computed(() => formatDate(props.task.startAt));
const formatTimeStartAt = computed(() => formatTime(props.task.startAt));
const formatDateEndAt = computed(() => formatDate(props.task.endAt));
const formatTimeEndAt = computed(() => formatTime(props.task.endAt));

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
