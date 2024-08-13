<template lang="pug">
    .resource-component(@mouseup="onMouseUp" @dragleave="onDragLeave")
        h1 {{resourceLength}}
        .resource-component__timeline
            cell-component(
                v-for="cell of resourceLength"
                :key="cell"
                :id="cell"
                ref="timeline"
                @task-has-drop.self="onTaskHasDrop"
                @task-over="onTaskOver"
            )
            task-component(
                v-for="task of tasks "
                :key="task.id"
                :task
                :start="placeTask(task).start"
                :end="placeTask(task).end"
                :draggable="task.draggable"
                ref="taskElements"
                @left-edge-down="onEdgeDown"
                @right-edge-down="onEdgeDown"
                @task-will-move="onTaskWillMove"
                @task-break-move="onTaskBreakMove"
            )
</template>

<script setup lang="ts">
import {
    computed,
    getCurrentInstance,
    inject,
    onMounted,
    type Ref,
    ref,
} from "vue";
import CellComponent from "@/components/workflow/CellComponent.vue";
import TaskComponent from "@/components/workflow/TaskComponent.vue";

const { proxy } = getCurrentInstance();
const MIN_TIMELINE_PX = proxy.$MIN_TIMELINE_PX;
const MIN_TIMELINE = proxy.$MIN_TIMELINE;
const props = defineProps<{ resource: Resource }>();
const emit = defineEmits(["taskWillMove"]);

const resourceLength = computed(
    () =>
        (new Date(props.resource.endAt).getTime() -
            new Date(props.resource.startAt).getTime()) /
        MIN_TIMELINE
);
const tasks = ref(
    props.resource.tasks.map((task) => ({ ...task, draggable: true }))
);
const timeline: Ref<CellComponent[]> = ref([]);
const placeTask = (task: Task) => {
    const startAt = new Date(props.resource.startAt).getTime();
    const endAt = new Date(props.resource.endAt).getTime();
    const taskStartAt = new Date(task.startAt).getTime();
    const taskEndAt = new Date(task.endAt).getTime();
    const taskLength = taskEndAt - taskStartAt;
    const start = Math.floor((taskStartAt - startAt) / proxy.$MIN_TIMELINE);
    const end = start + Math.floor(taskLength / proxy.$MIN_TIMELINE);
    return {
        start,
        end,
    };
};

const taskElements: Ref<TaskComponent[]> = ref([]);
const taskWillMoveData: TaskWillMoveData | undefined =
    inject<TaskWillMoveData>("taskWillMoveData");

const onEdgeDown = (taskId: number) => {
    const task = tasks.value.find((e) => e.id === taskId);
    if (!task) return;
    task.draggable = false;
};

const onMouseUp = () => {
    tasks.value.forEach((task) => {
        task.draggable = true;
    });
    recalcTimeline();
};

const recalcTimeline = () => {
    if (!timeline.value && !timeline.value.length) return;
    tasks.value.forEach((task) => {
        const { start, end } = placeTask(task);
        for (let i = start - 1; i < end - 1; i++) {
            if (timeline.value[i]) {
                timeline.value[i].setTaskId(task.id);
            } else {
                timeline.value[i].clear();
            }
        }
    });
};

const onTaskWillMove = (e: TaskWillMoveData) => {
    emit("taskWillMove", e);
    console.log("resource", taskWillMoveData);
};

const createPullCell = (
    id: number
): {
    pull: CellComponent[];
    edges: { leftEdge: CellComponent | null; rightEdge: CellComponent | null };
} => {
    if (!taskWillMoveData) return;
    const pull: CellComponent[] = [];

    const from = id - taskWillMoveData.cell;
    if (from < 0) return;

    for (let i = from; i < from + taskWillMoveData.totalCell; i++) {
        pull.push(timeline.value[i]);
    }

    const leftEdge = from - 1 < 0 ? null : timeline.value[from - 1];
    const rightEdge =
        from + taskWillMoveData.totalCell + 1 > resourceLength
            ? null
            : timeline.value[from + taskWillMoveData.totalCell + 1];
    const edges = {
        leftEdge,
        rightEdge,
    };
    return { pull, edges };
};
const onTaskOver = (id: number) => {
    console.log(
        id,
        taskWillMoveData?.taskId,
        taskWillMoveData?.totalCell,
        taskWillMoveData?.cell
    );
    const { pull: pullCells, edges } = createPullCell(id);
    const pullCellIds = pullCells.map((e) => e.getTaskId());

    //красим те cells, в которых планируется перемещение task
    const canMove = pullCellIds.every((e) => e === null);
    if (canMove) {
        pullCells.forEach((cell) => cell.setEnabledColor());
    } else {
        pullCells.forEach((cell) => cell.setDisabledColor());
    }

    //обуляем цвета пограничных cells
    edges.leftEdge && edges.leftEdge.clearColor();
    edges.rightEdge && edges.rightEdge.clearColor();
};

const onDragLeave = () => {
    timeline.value.forEach((cell) => cell.clearColor());
};

const onTaskBreakMove = () => {
    timeline.value.forEach((cell) => cell.clearColor());
};

const onTaskHasDrop = (id: number) => {
    console.log(id, taskWillMoveData);
};

onMounted(() => {
    recalcTimeline();
});
</script>

<style scoped lang="sass">
.resource-component

    &__timeline
        display: grid
        grid-template-columns: repeat(v-bind(resourceLength), v-bind(MIN_TIMELINE_PX))
        grid-template-rows: repeat(2, v-bind(MIN_TIMELINE_PX))
</style>
