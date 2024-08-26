<template lang="pug">
    .task-component(
        :draggable
        @dragstart="onDragStart"
        @dragend="emit('taskBreakMove')"
        @contextmenu.prevent="menu=true"
        ref="taskElement"
    )
        .task-component__edge.task-component__edge--left(
            @mousedown="emit('leftEdgeDown', task.id)"
        )
        .task-component__main() {{task.name}} {{start}} {{end}}
            v-menu(v-model="menu" :close-on-content-click="false" activator="parent" location="end" min-width="300px" )
                v-card.pa-2()
                    v-form
                        v-text-field(label="Описание" v-model.lazy="localTask.description")
                        set-time(v-model:startAt="localTask.startAt" v-model:endAt="localTask.endAt")
                        replace-to-resource(:resourceId="find.findResource.byTaskId(localTask.id)?.id" @change="onResourceChange")
                    .d-flex.justify-center
                        v-btn-group
                            v-btn.flex-grow-1(color="orange-darken-1" @click="onTaskChange") Изменить
                            v-btn.flex-grow-1(color="grey-lighten-3" @click="menu=false") Отмена

        .task-component__edge.task-component__edge--right(
            @mousedown="emit('rightEdgeDown', task.id)"
        )
        v-tooltip(
            activator="parent"
            location="bottom"
        )
            h3 {{task.name}}
            p {{task.description}}
            div Время начала:
                time {{formatDateStartAt}}&nbsp;
                time
                    strong {{formatTimeStartAt}}
            div Время завершения:
                time {{formatDateEndAt}}&nbsp;
                time
                    strong {{formatTimeEndAt}}

</template>

<script setup lang="ts">
import { computed, getCurrentInstance, ref, watch } from "vue";
import SetTime from "@/components/workflow/SetTime.vue";
import ReplaceToResource from "@/components/workflow/ReplaceToResource.vue";
import { useWorkflowStore } from "@/pinia-store/workflow";

const { proxy } = getCurrentInstance();

const menu = ref(false);
const { find, replaceTask } = useWorkflowStore();

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
const localTask = ref({ ...props.task });
const changingResource = ref(find.findResource.byTaskId(props.task.id)?.id);

const taskElement = ref<HTMLDivElement>();
const widthComponent = computed(() => taskElement.value?.offsetWidth);
const totalCellInComponent = computed(
    () =>
        (new Date(localTask.value.endAt).getTime() -
            new Date(localTask.value.startAt).getTime()) /
        proxy.$MIN_TIMELINE
);
const pointerEvent = computed(() => (props.draggable ? "all" : "none"));

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

const onResourceChange = (resourceId: number) => {
    changingResource.value = resourceId;
};

const onTaskChange = () => {
    menu.value = false;
    console.log(localTask.value, changingResource.value);
    if (!localTask.value) return;
    if (
        find.findResource.byTaskId(props.task.id)?.id !==
            changingResource.value &&
        typeof changingResource.value === "number"
    ) {
        replaceTask(
            localTask.value.id,
            changingResource.value,
            localTask.value.startAt,
            localTask.value.endAt
        );
    }
};

watch(
    [props],
    () => {
        localTask.value = { ...props.task };
    },
    { deep: true }
);
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
    pointer-events: v-bind(pointerEvent)

    &__edge
        background-color: #00c853
        cursor: col-resize
        pointer-events: all

    &__main
        overflow: hidden
        pointer-events: inherit
</style>
