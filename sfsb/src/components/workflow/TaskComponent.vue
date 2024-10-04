<template lang="pug">
    .task(
        ref="element"
        :draggable="canDraggable"
        @dragend="onDragEnd"
        @dragstart="onDragStart"
        @mousedown.right.prevent.stop="onMouseDown($event)"
        @contextmenu.prevent.stop="onContextMenu($event)"
        :style="{width: duration + 'px', left: left + 'px', boxShadow}"
    )
        .task__border.task__border_left(@mousedown.prevent="selectBorder($event,'left')")
        .task__caption
            h4 {{name}}
            div {{consoleText}}
            p {{description}}
        .task__border.task__border_right(@mousedown.prevent="selectBorder($event,'right')")

        v-tooltip(
            activator="parent"
            location="bottom"
        )
            h3 {{name}}
            p {{description}}
            div Время начала:
                time {{new Date(startAt).toLocaleDateString()}}&nbsp;
                time
                    strong {{new Date(startAt).toLocaleTimeString()}}
            div Время завершения:
                time {{new Date(endAt).toLocaleDateString()}}&nbsp;
                time
                    strong {{new Date(endAt).toLocaleTimeString()}}

        ParamsTask(v-model:menu="menu" v-model:task="props.task" @change="onChange($event)")
</template>
<script setup lang="ts">
import { computed, inject, ref, type Ref, toRefs } from "vue";
import { storeToRefs } from "pinia";
import useTaskMoving from "@/pinia-store/taskMoving";
import { useWorkflow } from "@/pinia-store/workflow";
import ParamsTask from "@/components/workflow/ParamsTask.vue";

const props = defineProps<{ task: Task; active: boolean }>();

const { startAt, endAt, name, description, color } = toRefs(props.task);

const scale = inject<Ref<number>>("scale");
const canDraggable = ref(true);

const menu = ref(false); // Показывать меню

const { taskMoving, borderMoving, borderMovingPreviousState } = storeToRefs(
    useTaskMoving()
);
const { getFirstTask, resources } = storeToRefs(useWorkflow());
const { reorderTask } = useWorkflow();

const startDate = new Date(getFirstTask.value.startAt).setHours(0, 0, 0, 0);

const element = ref<HTMLDivElement>();
const boxShadow = computed(
    () => `0 0 ${props.active ? "18px" : "0"} ${props.task.color}`
);
// const color = computed(() => props.task.color);

const consoleText = ref("");

defineExpose({ element, id: props.task.id });
const { scrollBody } = storeToRefs(useTaskMoving());
const duration = computed(
    () =>
        ((new Date(props.task.endAt).getTime() -
            new Date(props.task.startAt).getTime()) /
            (3600 * 1000)) *
        scale!.value
);

const left = computed(
    () =>
        ((new Date(props.task.startAt).getTime() - startDate) / (3600 * 1000)) *
        scale!.value
);

const onDragStart = (e: DragEvent) => {
    e.dataTransfer!.setData(
        "task",
        JSON.stringify({ ...props.task, offsetX: e.offsetX, x: e.x })
    );
    taskMoving.value = {
        ...props.task,
        previousState: props.task,
        offsetX: e.offsetX,
        x: e.x,
    };
};

const onDragEnd = () => {
    taskMoving.value = null;
};

const selectBorder = (event: MouseEvent, border: "left" | "right") => {
    borderMoving.value = {
        ...props.task,
        border,
        x: event.x + scrollBody.value,
    };
    !borderMovingPreviousState.value &&
        (borderMovingPreviousState.value = { ...props.task });
};

const onChange = ({
    endAt,
    startAt,
    description,
    workflowId,
    name,
    color,
}: Task) => {
    console.log("data to change");
    reorderTask(
        { ...props.task, startAt, endAt, description, workflowId },
        props.task
    );
};

const onMouseDown = (event: MouseEvent) => {
    console.log("event.button", event.button);
    if (event.button !== 2) return;
    menu.value = !menu.value;
};

const onContextMenu = (event: MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
};

// watch([props], () => {
//     console.log("TaskComponent props was changed", props);
// });
// watch([props.task], () => {
//     console.log("TaskComponent props.task was changed", props.task);
// });
// watch([startAt], () => {
//     console.log("TaskComponent startAt was changed", startAt.value);
// });
// watch([endAt], () => {
//     console.log("TaskComponent endAt was changed", endAt.value);
// });
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
