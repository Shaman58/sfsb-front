<template lang="pug">
    .resource-component(@mouseup="onMouseUp")
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

const createPullCell = (id: number): CellComponent[] => {
    if (!taskWillMoveData) return;
    let res = [];
    const from = id - taskWillMoveData.cell;
    if (from < 0) return;

    for (let i = from; i < from + taskWillMoveData.totalCell; i++) {
        res.push(timeline.value[i]);
    }
    return res;
};
const onTaskOver = (id: number) => {
    console.log(
        id,
        taskWillMoveData?.taskId,
        taskWillMoveData?.totalCell,
        taskWillMoveData?.cell
    );
    console.log(createPullCell(id).map((e) => e.getTaskId()));
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
