<template lang="pug">
    .task(
        ref="element"
        :draggable="canDraggable"
        @dragend="onDragEnd"
        @dragstart="onDragStart"
        :style="{width: duration + 'px', left: left + 'px', boxShadow}"
    )
        .task__border.task__border_left(@mousedown.prevent="selectBorder('left')")
        .task__caption
            h4 {{props.task.name}}
            p {{props.task.description}}
        .task__border.task__border_right(@mousedown.prevent="selectBorder('right')")
</template>
<script setup lang="ts">
import { computed, inject, ref, type Ref, toRefs } from "vue";
import { storeToRefs } from "pinia";
import useTaskMoving from "@/pinia-store/taskMoving";

const props = defineProps<{ task: Task; active: boolean }>();
const { startAt, endAt, color } = toRefs(props.task);

const scale = inject<Ref<number>>("scale");
const canDraggable = ref(true);

const { taskMoving, borderMoving } = storeToRefs(useTaskMoving());

const element = ref<HTMLDivElement>();
const boxShadow = computed(
    () => `0 0 ${props.active ? "18px" : "0"} ${color.value}`
);

defineExpose({ element, id: props.task.id });

const duration = computed(
    () =>
        ((new Date(endAt.value).getTime() - new Date(startAt.value).getTime()) /
            (3600 * 1000)) *
        scale!.value
);
const left = computed(
    () =>
        ((new Date(startAt.value).getTime() -
            new Date("2024-09-02T00:00:00").getTime()) /
            (3600 * 1000)) *
        scale!.value
);

const onDragStart = (e: DragEvent) => {
    e.dataTransfer!.setData(
        "task",
        JSON.stringify({ ...props.task, offsetX: e.offsetX })
    );
    taskMoving.value = { ...props.task, offsetX: e.offsetX };
};

const onDragEnd = (e: DragEvent) => {
    taskMoving.value = null;
};

const selectBorder = (border: "left" | "right") => {
    borderMoving.value = { ...props.task, border };
};
</script>

<style scoped lang="sass">
.task
    --margin: 4px
    box-sizing: border-box
    background-color: v-bind(color)
    height: calc(100% - var(--margin) * 2)
    position: absolute
    top: var(--margin)
    display: flex
    justify-content: space-between

    &__border
        width: 8px
        background-color: #000
        border-inline: 1px solid #fff

    &__caption
        flex: 1
        display: grid
        place-items: center
</style>
