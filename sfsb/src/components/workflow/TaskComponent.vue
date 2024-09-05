<template lang="pug">
    .task(draggable="true" @dragend="onDragEnd" @dragstart="onDragStart" :style="{width: duration + 'px', left: left + 'px'}") {{scale}} {{duration}}

</template>
<script setup lang="ts">
import { computed, inject, type Ref, toRefs } from "vue";

const props = defineProps<{ task: Task }>();
const { startAt, endAt, color } = toRefs(props.task);
const scale = inject<Ref<number>>("scale");
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
};

const onDragEnd = (e: DragEvent) => {};
</script>

<style scoped lang="sass">
.task
    --margin: 4px
    box-sizing: border-box
    background-color: v-bind(color)
    height: calc(100% - var(--margin) * 2)
    position: absolute
    top: var(--margin)
</style>
