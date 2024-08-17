<template lang="pug">
    .resource-component
        h1 {{resourceLength}}
        .resource-component__timeline
            cell-component(
                v-for="cell of resourceLength"
                :key="cell"
                :id="cell"
                :resource-id="resource.id"
                ref="timeline"
            )
            task-component(
                v-for="task of tasks "
                :key="task.id"
                :task
                :resource-id="resource.id"
                :start="placeTask(task).start"
                :end="placeTask(task).end"
                :draggable="task.draggable"
                ref="taskElements"
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

const { proxy } = getCurrentInstance();
const MIN_TIMELINE_PX = proxy.$MIN_TIMELINE_PX;
const MIN_TIMELINE = proxy.$MIN_TIMELINE;
const props = defineProps<{ resource: Resource }>();

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

const taskElements: Ref<TaskComponent[]> = ref([]);

onMounted(() => {
    recalcTimeline();
});
watch(
    () => props.resource.tasks,
    () => {
        tasks.value = props.resource.tasks.map((e) => ({
            ...e,
            draggable: true,
        }));
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
</style>
