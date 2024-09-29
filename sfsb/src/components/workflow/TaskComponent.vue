<template lang="pug">
    .task(
        ref="element"
        :draggable="canDraggable"
        @dragend="onDragEnd"
        @dragstart="onDragStart"
        @contextmenu.prevent.stop="menu=true"
        :style="{width: duration + 'px', left: left + 'px', boxShadow}"
    )
        .task__border.task__border_left(@mousedown.prevent="selectBorder($event,'left')")
        .task__caption
            h4 {{props.task.name}}
            div {{consoleText}}
            p {{props.task.description}}
        .task__border.task__border_right(@mousedown.prevent="selectBorder($event,'right')")

        v-tooltip(
            activator="parent"
            location="bottom"
        )
            h3 {{task.name}}
            p {{task.description}}
            div Время начала:
                time {{new Date(task.startAt).toLocaleDateString()}}&nbsp;
                time
                    strong {{new Date(task.startAt).toLocaleTimeString()}}
            div Время завершения:
                time {{new Date(task.endAt).toLocaleDateString()}}&nbsp;
                time
                    strong {{new Date(task.endAt).toLocaleTimeString()}}

        ParamsTask(v-model:menu="menu" v-model:task="props.task" @change="onChange($event)")
</template>
<script setup lang="ts">
import { computed, inject, ref, type Ref, toRefs, watch } from "vue";
import { storeToRefs } from "pinia";
import useTaskMoving from "@/pinia-store/taskMoving";
import { useWorkflow } from "@/pinia-store/workflow";
import ParamsTask from "@/components/workflow/ParamsTask.vue";

const props = defineProps<{ task: Task; active: boolean }>();
const { startAt, endAt, color } = toRefs(props.task);

const scale = inject<Ref<number>>("scale");
const canDraggable = ref(true);

const menu = ref(false); // Показывать меню

const { taskMoving, borderMoving } = storeToRefs(useTaskMoving());
const { getFirstTask } = storeToRefs(useWorkflow());
const { relocateTask } = useWorkflow();

const startDate = new Date(getFirstTask.value.startAt).setHours(0, 0, 0, 0);

const element = ref<HTMLDivElement>();
const boxShadow = computed(
    () => `0 0 ${props.active ? "18px" : "0"} ${color.value}`
);

const consoleText = ref("");

defineExpose({ element, id: props.task.id });
const { scrollBody } = storeToRefs(useTaskMoving());
const duration = computed(
    () =>
        ((new Date(endAt.value).getTime() - new Date(startAt.value).getTime()) /
            (3600 * 1000)) *
        scale!.value
);
const left = computed(
    () =>
        ((new Date(startAt.value).getTime() - startDate) / (3600 * 1000)) *
        scale!.value
);

const onDragStart = (e: DragEvent) => {
    e.dataTransfer!.setData(
        "task",
        JSON.stringify({ ...props.task, offsetX: e.offsetX, x: e.x })
    );
    taskMoving.value = { ...props.task, offsetX: e.offsetX, x: e.x };
};

const onDragEnd = (e: DragEvent) => {
    taskMoving.value = null;
};

const selectBorder = (event: MouseEvent, border: "left" | "right") => {
    borderMoving.value = {
        ...props.task,
        border,
        x: event.x + scrollBody.value,
    };
};

const onChange = (newValue: Task) => {
    console.log("data to change", newValue);
    relocateTask(newValue.id, newValue.workflowId, {
        startAt: newValue.startAt,
        endAt: newValue.endAt,
    });
};
watch([props.task], () => {
    console.log("props.task", props.task);
});
watch([left], () => {
    console.log("left", left.value);
});
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
