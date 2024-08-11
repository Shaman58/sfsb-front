<template lang="pug">
    .resource-component
        h1 {{resourceLength}}
        .resource-component__timeline
            cell-component(v-for="cell of resourceLength" :key="cell" :id="cell" ref="timeline")
            task-component(
                v-for="task of props.resource.tasks "
                :key="task.id"
                :task
                :start="placeTask(task).start"
                :end="placeTask(task).end"
            )
</template>

<script setup lang="ts">
import { computed, getCurrentInstance, onMounted, type Ref, ref } from "vue";
import CellComponent from "@/components/workflow/CellComponent.vue";
import TaskComponent from "@/components/workflow/TaskComponent.vue";

const { proxy } = getCurrentInstance();
const props = defineProps<{ resource: Resource }>();
const resourceLength = computed(
    () =>
        (new Date(props.resource.endAt).getTime() -
            new Date(props.resource.startAt).getTime()) /
        proxy.$MIN_TIMELINE
);
const tasks = ref(props.resource.tasks);
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

onMounted(() => {
    recalcTimeline();
});
</script>

<style scoped lang="sass">
.resource-component

    &__timeline
        display: grid
        grid-template-columns: repeat(v-bind(resourceLength), 30px)
        grid-template-rows: repeat(2, 30px)
</style>
