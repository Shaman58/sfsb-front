<template lang="pug">
    .resource(
        ref="resourceRef"
        @dragover.prevent="dragover"
        @drop.prevent="drop"
        @dragenter.prevent="dragenter"
        @dragleave.prevent="dragleave"
        @mouseup.prevent="mouseup"
        @mousemove.prevent="mousemove"
        :style="{width: overallWidth+'px'}"
    )
        shadow(ref="shadowRef" :resource-id="resource.id" :intersected)
        task-component(
            ref="taskRefs"
            v-for="task in tasks"
            :key="task.id"
            :active="isActive(task)"
            :task
        )
</template>

<script setup lang="ts">
import TaskComponent from "@/components/workflow/TaskComponent.vue";
import { computed, inject, onMounted, ref, toValue, watch } from "vue";
import { storeToRefs } from "pinia";
import useTaskMoving from "@/pinia-store/taskMoving";
import { coordinatesToTime } from "@/mixins/coordinatesAndTime";
import { useToast } from "vue-toast-notification";
import { useWorkflow } from "@/pinia-store/workflow";
import Shadow from "@/components/workflow/Shadow.vue";

const toast = useToast();
const props = defineProps<{ resource: Resource; overallWidth: number }>();

const shadowRef = ref<Shadow>();
const tasks = ref(props.resource.tasks);
const taskRefs = ref<TaskComponent[]>([]);
const resourceRef = ref<HTMLElement>();

const intersected = ref(false);

const scale = inject("scale");

const {
    taskMoving,
    borderMoving,
    scrollBody,
    activeResource,
    borderMovingPreviousState,
} = storeToRefs(useTaskMoving());
const {
    relocateTask,
    resources,
    getResourceByTaskId,
    sendTask,
    toLocaleDate,
    reorderTask,
} = useWorkflow();
const { getFirstDayStart, getAllTasks } = storeToRefs(useWorkflow());

const tracking = computed(() => taskMoving.value);
const durationTrackingTask = computed(() => {
    if (!taskMoving.value && !borderMoving.value) return 0;
    if (tracking.value) {
        return (
            ((new Date(taskMoving.value!.endAt).getTime() -
                new Date(taskMoving.value!.startAt).getTime()) /
                (3600 * 1000)) *
            scale!.value
        );
    }
    if (borderMoving.value) {
        return (
            ((new Date(borderMoving.value.endAt).getTime() -
                new Date(borderMoving.value.startAt).getTime()) /
                (3600 * 1000)) *
            scale!.value
        );
    }
    return 0;
});

const isActive = (task: Task) => task.id === taskMoving.value?.id;
const dragOverPosition = ref(0);

const dragover = (e: DragEvent) => {
    activeResource.value = props.resource.id;
    console.log("dragover", scrollBody.value);
    if (dragOverPosition.value === e.x + scrollBody.value) return;
    dragOverPosition.value = e.x + scrollBody.value - taskMoving.value?.offsetX;
    taskMoving.value && (taskMoving.value.x = dragOverPosition.value);
    // if (!taskShadow.value) return;
    intersected.value = isIntersected();
    console.log("intersected.value", intersected.value);
};
const drop = async (e: DragEvent) => {
    // if (intersected.value)
    //     return toast.error("Это время занято другой задачей");
    const droppedTask: Task & { offsetX: number } = JSON.parse(
        e.dataTransfer?.getData("task")
    );
    console.log("drop", e, droppedTask);

    let matchTaskIndex = tasks.value.findIndex((e) => e.id === droppedTask.id);
    if (matchTaskIndex === -1) {
        const newStartDate = coordinatesToTime(
            e.x + scrollBody.value - droppedTask.offsetX,
            scale.value,
            getFirstDayStart.value
        );
        const newEndDate = coordinatesToTime(
            e.x +
                scrollBody.value -
                droppedTask.offsetX +
                durationTrackingTask.value,
            scale.value,
            getFirstDayStart.value
        );

        // relocateTask(droppedTask.id, props.resource, {
        //     startAt: newStartDate,
        //     endAt: newEndDate,
        // });
        taskMoving.value?.previousState &&
            reorderTask(
                {
                    ...taskMoving.value,
                    startAt: toLocaleDate(newStartDate),
                    endAt: toLocaleDate(newEndDate),
                    workflowId: props.resource.id,
                } as Task,
                toValue(taskMoving.value.previousState)
            );
    } else {
        const newStartDate = coordinatesToTime(
            e.x + scrollBody.value - droppedTask.offsetX,
            scale.value,
            getFirstDayStart.value
        );
        const newEndDate = coordinatesToTime(
            e.x +
                scrollBody.value -
                droppedTask.offsetX +
                durationTrackingTask.value,
            scale.value,
            getFirstDayStart.value
        );
        // tasks.value[matchTaskIndex].startAt = newStartDate;
        // tasks.value[matchTaskIndex].endAt = newEndDate;
        const res = await sendTask(
            {
                ...taskMoving.value,
                startAt: toLocaleDate(newStartDate),
                endAt: toLocaleDate(newEndDate),
            } as Task,
            taskMoving.value?.previousState
        );
        if (res) {
            tasks.value[matchTaskIndex].startAt = newStartDate;
            tasks.value[matchTaskIndex].endAt = newEndDate;
        }
    }
};
const dragenter = () => {};
const dragleave = () => {};
const mouseup = () => {
    console.log("mouseup", borderMoving.value);
    borderMoving.value &&
        sendTask(
            borderMoving.value as Task & { offsetX: number; x: number },
            borderMovingPreviousState.value
        );
    borderMoving.value = null;
};
const mousemove = (e: MouseEvent) => {
    activeResource.value = props.resource.id;
    const { x } = e;
    if (!borderMoving.value) return;
    borderMoving.value.x = e.x;
    intersected.value = isIntersected();
    console.log("intersected.value", intersected.value);

    const prevTime =
        borderMoving.value.border === "left"
            ? borderMoving.value.startAt
            : borderMoving.value.endAt;

    const time = coordinatesToTime(
        x + scrollBody.value,
        scale.value,
        getFirstDayStart.value
    );
    const taskIndex = tasks.value.findIndex(
        (e) => e.id === borderMoving.value?.id
    );
    console.log(borderMoving.value.startAt, borderMoving.value.endAt);
    if (taskIndex === -1) return;

    if (borderMoving.value.border === "left") {
        tasks.value[taskIndex].startAt = toLocaleDate(time);
        borderMoving.value.startAt = toLocaleDate(time);
    }
    if (borderMoving.value.border === "right") {
        tasks.value[taskIndex].endAt = toLocaleDate(time);
        borderMoving.value.endAt = toLocaleDate(time);
    }
    // if (intersected.value) {
    //     toast.error("Это время занято другой задачей");
    //     if (borderMoving.value.border === "left") {
    //         tasks.value[taskIndex].startAt = prevTime;
    //         borderMoving.value.startAt = prevTime;
    //     }
    //     if (borderMoving.value.border === "right") {
    //         tasks.value[taskIndex].endAt = prevTime;
    //         borderMoving.value.endAt = prevTime;
    //     }
    // }
};

watch(
    () => props.resource.tasks,
    (newTasks) => {
        console.log("newTasks", newTasks);
        tasks.value = newTasks;
    },
    { deep: true, immediate: true }
);
watch(
    [tasks],
    () => {
        const currentResource = resources.find(
            (e) => e.id === props.resource.id
        );
        if (!currentResource) return;
        currentResource.tasks = tasks.value;
    },
    { deep: true }
);

const isIntersected = () => {
    console.log("taskRefs.value", taskRefs.value);
    if (taskRefs.value?.length === 0) return false;
    return taskRefs.value?.some((e) => {
        if (e.id === borderMoving.value?.id || e.id === taskMoving.value?.id)
            return false;
        const { left: taskLeft, width: taskWidth } =
            e.element.getBoundingClientRect();
        const taskRight = taskLeft + taskWidth;

        console.log({ taskLeft, taskRight });

        const { left: shadowLeft, width: shadowWidth } =
            shadowRef.value!.element.getBoundingClientRect();
        const shadowRight = shadowLeft + shadowWidth;

        console.log({ shadowLeft, shadowRight });

        return (
            (shadowLeft > taskLeft && shadowLeft < taskRight) ||
            (shadowRight < taskRight && shadowRight > taskLeft) ||
            (shadowLeft < taskLeft && shadowRight > taskRight)
        );
    });
};

onMounted(() => {
    console.log("mounted");
    console.log("taskRefs.value", taskRefs.value);
    console.log("shadowRef.value", shadowRef.value);
});

watch([taskMoving], () => {
    intersected.value = isIntersected();
});
watch([getAllTasks], () => {
    console.log("getAllTasks from resource", getAllTasks.value);
});
</script>

<style scoped lang="sass">
.resource
    position: relative
    height: 60px
    margin-left: 0
    margin-right: 0
    //width: 100cqw
    background-color: #fff2
    backdrop-filter: blur(2px)
    margin-block: 4px
    box-shadow: 8px 8px 18px #0003, 8px 8px 6px #fff6 inset

.task-shadow
    height: 100%
    opacity: 0.5
    position: absolute
    top: 0
    left: 0

    &.over
        background-color: #77f7
</style>
