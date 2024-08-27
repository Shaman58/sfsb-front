<template lang="pug">
    .resource-component(
        @mouseup="onMouseUp"
        @dragleave="onDragLeave"
        @mouseleave="onMouseLeave"
    )
        h2.resource-component__title {{resource.name}}
        .resource-component__timeline
            cell-component(
                v-for="cell of resourceLength"
                :key="cell"
                :id="cell"
                ref="timeline"
                @task-has-drop.self="onTaskHasDrop"
                @task-over="onTaskOver"
                @cell-mouse-move="onCellMove"
            )
            task-component(
                v-for="task of tasks "
                :key="task.id"
                :task
                :start="placeTask(task).start"
                :end="placeTask(task).end"
                :draggable="task.draggable"
                ref="taskElements"
                @left-edge-down="onLeftEdgeDown"
                @right-edge-down="onRightEdgeDown"
                @task-will-move="onTaskWillMove"
                @task-break-move="onTaskBreakMove"
            )
</template>

<script setup lang="ts">
import {
    computed,
    getCurrentInstance,
    onMounted,
    type Ref,
    ref,
    watch,
} from "vue";
import CellComponent from "@/components/workflow/CellComponent.vue";
import TaskComponent from "@/components/workflow/TaskComponent.vue";
import { useWorkflowStore } from "@/pinia-store/workflow";

const { proxy } = getCurrentInstance();
const MIN_TIMELINE_PX = proxy.$MIN_TIMELINE_PX;
const MIN_TIMELINE = proxy.$MIN_TIMELINE;
const props = defineProps<{ resource: Resource; clean: boolean }>();
const emit = defineEmits([
    "taskWillMove",
    "alignTask",
    "taskCanMove",
    "edgeMove",
]);
const movingTaskLeftEdge = ref<Task | null>(null);
const movingTaskRightEdge = ref<Task | null>(null);

const resourceLength = computed(
    () =>
        (new Date(props.resource.endAt).getTime() -
            new Date(props.resource.startAt).getTime()) /
        MIN_TIMELINE
);
const tasks = ref(props.resource.tasks.map((e) => ({ ...e, draggable: true })));
const timeline: Ref<CellComponent[]> = ref([]);
const taskCanMove = ref(false);
const onCellMoveX = ref(0);

const { resources, changeTask, taskWillMoveData, find } = useWorkflowStore();

const onBtnClick = () => {
    const task = resources[0].tasks[0];
    const { endAt } = task;
    const newEndAt = new Date(
        new Date(endAt).getTime() + 30 * 60 * 1000
    ).toISOString();
    changeTask.endAt(task.id, newEndAt);
};

const placeTask = (task: Task) => {
    const startAt = new Date(props.resource.startAt).getTime();
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

const onEdgeDown = (taskId: number, signal: Ref<Task | null>) => {
    const task = tasks.value.find((e) => e.id === taskId);
    if (!task) return;
    task.draggable = false;
    signal.value = task;
};

const onLeftEdgeDown = (taskId: number) => {
    onEdgeDown(taskId, movingTaskLeftEdge);
};
const onRightEdgeDown = (taskId: number) => {
    onEdgeDown(taskId, movingTaskRightEdge);
};

const onMouseUp = () => {
    tasks.value.forEach((task) => {
        task.draggable = true;
    });
    recalcTimeline();
    movingTaskLeftEdge.value = null;
    movingTaskRightEdge.value = null;
};

const getCellIdByTime = (
    time: string,
    currentResource: Resource = props.resource
) => {
    const currentTime = new Date(time);
    const res =
        (currentTime.getTime() - new Date(currentResource.startAt).getTime()) /
        MIN_TIMELINE;
    return res;
};
/*
    taskId: number,
    edge: "left" | "right",
    direction: "left" | "right"
 */
const onCellMove = (id: number, taskId: number, e: MouseEvent) => {
    console.log("cell mouse move");
    //ограничение на минимальное смещение
    const { x } = e;
    const delta = Math.abs(onCellMoveX.value - x);
    if (delta < 30) return;
    onCellMoveX.value = x;

    if (!movingTaskRightEdge.value && !movingTaskLeftEdge.value) return;
    const currentTask = movingTaskRightEdge.value || movingTaskLeftEdge.value;
    if (!currentTask) return;

    if (taskId !== currentTask?.id && taskId !== null) return;

    const edge = !!movingTaskLeftEdge.value ? "left" : "right";

    //определить какие cell занимают левая и правая границы таски
    const leftTaskCellId = getCellIdByTime(currentTask.startAt);
    const rightTaskCellId = getCellIdByTime(currentTask.endAt) - 1;
    console.log({ id, leftTaskCellId, rightTaskCellId });

    //какое планируется смещение границы левое или правое по id cell и task
    if (id === leftTaskCellId || id === rightTaskCellId) return;
    let direction;
    if (movingTaskLeftEdge.value)
        direction = id < leftTaskCellId ? "left" : "right";
    if (movingTaskRightEdge.value)
        direction = id < rightTaskCellId ? "left" : "right";
    emit("edgeMove", currentTask.id, edge, direction);
};

const zeroizeTimeline = () => {
    timeline.value.forEach((e) => {
        e.clear();
    });
};

const recalcTimeline = () => {
    if (!timeline.value.length) return;
    tasks.value.forEach((task) => {
        const { start, end } = placeTask(task);
        for (let i = start - 1; i < end - 1; i++) {
            if (timeline.value[i]) {
                timeline.value[i]
                    .setTaskId(task.id)
                    .catch((e) => console.error(e));
            } else {
                timeline.value[i].clear();
            }
        }
    });
};

const onTaskWillMove = (e: TaskWillMoveData) => {
    emit("taskWillMove", {
        ...e,
        resourceId: props.resource.id,
    });
    console.log("resource", taskWillMoveData);
};

const createPullCell = (
    cellId: number
): {
    pull: CellComponent[];
    edges: { leftEdge: CellComponent | null; rightEdge: CellComponent | null };
} => {
    if (!taskWillMoveData) return;
    const pull: CellComponent[] = [];
    const edges: {
        leftEdge: CellComponent | null;
        rightEdge: CellComponent | null;
    } = {
        leftEdge: null,
        rightEdge: null,
    };

    const from = cellId - taskWillMoveData.cell;
    if (from >= 0) {
        for (let i = from; i < from + taskWillMoveData.totalCell; i++) {
            pull.push(timeline.value[i]);
        }

        const leftEdge = from - 1 < 0 ? null : timeline.value[from - 1];
        const rightEdge =
            from + taskWillMoveData.totalCell + 1 > resourceLength
                ? null
                : timeline.value[from + taskWillMoveData.totalCell + 1];
        const edges = {
            leftEdge: leftEdge,
            rightEdge: rightEdge,
        };
    }

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
    taskCanMove.value = pullCellIds.every(
        (e) => e === null || e === taskWillMoveData?.taskId
    );
    emit("taskCanMove", taskCanMove.value);
    if (taskCanMove.value) {
        pullCells.forEach((cell) => cell.setEnabledColor());
    } else {
        pullCells.forEach((cell) => cell.setDisabledColor());
    }

    //обуляем цвета пограничных cells
    edges.leftEdge && edges.leftEdge.clearColor();
    edges.rightEdge && edges.rightEdge.clearColor();

    //определяем своя таска или чужая
    if (!taskWillMoveData || !taskWillMoveData.taskId) return;
    const task = tasks.value.find((e) => e.id === taskWillMoveData.taskId);
    !task && emit("alignTask", props.resource.id);
};

const onDragLeave = () => {
    timeline.value.forEach((cell) => cell.clearColor());
};

const onMouseLeave = () => {
    movingTaskLeftEdge.value = null;
    movingTaskRightEdge.value = null;
};

const onTaskBreakMove = () => {
    timeline.value.forEach((cell) => cell.clearColor());
    emit("taskWillMove", null);
};

const onTaskHasDrop = (id: number) => {
    console.log(id, taskWillMoveData);
};

onMounted(() => {
    recalcTimeline();
});

watch(
    () => props.clean,
    () => {
        timeline.value.forEach((cell) => cell.clearColor());
    }
);

watch(
    () => props.resource.tasks,
    (value, oldValue) => {
        console.log("props.resource.tasks изменились", oldValue, value);
        zeroizeTimeline();
        tasks.value = props.resource.tasks.map((e) => {
            const draggable =
                e.id === movingTaskLeftEdge.value?.id ||
                e.id === movingTaskRightEdge.value?.id
                    ? false
                    : true;
            return { ...e, draggable };
        });
        recalcTimeline();
    },
    { deep: true }
);

watch(
    [resources],
    () => {
        const resource = find.findResource.byId(props.resource.id);
        if (!resource) return;
        tasks.value = resource.tasks.map((e) => {
            const draggable =
                e.id === movingTaskLeftEdge.value?.id ||
                e.id === movingTaskRightEdge.value?.id
                    ? false
                    : true;
            return { ...e, draggable };
        });
    },
    { deep: true }
);
</script>

<style scoped lang="sass">
.resource-component

    &__timeline
        display: grid
        grid-template-columns: repeat(v-bind(resourceLength), v-bind(MIN_TIMELINE_PX))
        grid-template-rows: repeat(2, v-bind(MIN_TIMELINE_PX))

    &__title
        position: sticky
        left: 0
        width: max-content
</style>
