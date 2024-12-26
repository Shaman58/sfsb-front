<template lang="pug">
    .task(
        ref="element"
        :draggable="canDraggable"
        @dragend="onDragEnd"
        @dragstart="onDragStart"
        @mouseup="onMouseUp"
        @mousedown.right.prevent.stop="onMouseDown($event)"
        @contextmenu.prevent.stop="onContextMenu($event)"
        :style="{width: duration + 'px', left: left + 'px', boxShadow, cursor}"
        @mouseenter="mouseEnter = true"
        @mouseleave="mouseEnter = false"
        @mousemove="onMouseMove($event)"
    )
        .task__border.task__border_left(@mousedown.prevent="selectBorder($event,'left')")
        .task__caption(ref="taskCaption")
            h4 {{name}}
            div {{consoleText}}
            p {{orderNumber}}
        .task__border.task__border_right(@mousedown.prevent="selectBorder($event,'right')")


        v-tooltip(
            activator="parent"
            location="bottom"
        )
            h3 {{name}}
            p {{description}}
            div Номер заказа:
                strong {{orderNumber}}
            div Время начала:
                time {{new Date(startAt).toLocaleDateString()}}&nbsp;
                time
                    strong {{new Date(startAt).toLocaleTimeString()}}
            div Время завершения:
                time {{new Date(endAt).toLocaleDateString()}}&nbsp;
                time
                    strong {{new Date(endAt).toLocaleTimeString()}}

        ParamsTask(v-model:menu="menu" v-model:task="props.task" @change="onChange($event)" @apply-calendar="applyCalendar($event)")

        v-tooltip(v-model="isSplitActive" :style="{ top: `${tooltipPosition.y}px`, left: `${tooltipPosition.x}px`, position: 'absolute' }")
            span Время разделения: {{splitText}}
</template>
<script setup lang="ts">
import {computed, inject, onMounted, onUnmounted, ref, type Ref, toRefs, watch} from "vue";
import {storeToRefs} from "pinia";
import useTaskMoving from "@/pinia-store/taskMoving";
import {useWorkflow} from "@/pinia-store/workflow";
import ParamsTask from "@/components/workflow/ParamsTask.vue";

const props = defineProps<{ task: Task; active: boolean }>();

const {startAt, endAt, name, description, color, orderNumber} = toRefs(props.task);

const emit = defineEmits(["busyEvent"]);

const scale = inject<Ref<number>>("scale");
const canDraggable = ref(true);

const menu = ref(false); // Показывать меню

const splitMode = inject<Ref<boolean>>("splitMode");
const splitText = ref("splitText");
const mouseEnter = ref(false);
const isSplitActive = computed(() => splitMode?.value && mouseEnter.value);
const tooltipPosition = ref({x: 0, y: 0});
const tooltipVisible = ref(false);

const {taskMoving, borderMoving, borderMovingPreviousState} = storeToRefs(
    useTaskMoving()
);
const {getFirstTask, resources, busy} = storeToRefs(useWorkflow());
const {reorderTask, split, applyCalendarToTask} = useWorkflow();

const startDate = new Date(getFirstTask.value.startAt).setHours(0, 0, 0, 0);

const element = ref<HTMLDivElement>();
const taskCaption = ref<HTMLDivElement>();
const OFFSET = 90;

const boxShadow = computed(
    () => `0 0 ${props.active ? "18px" : "0"} ${props.task.color}`
);
// const color = computed(() => props.task.color);

const consoleText = ref("");

defineExpose({element, id: props.task.id});
const {scrollBody} = storeToRefs(useTaskMoving());
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

const cursor = computed(() => {
    let res = "pointer";
    if (splitMode?.value) res = "col-resize";
    if (busy.value) res = "wait";
    return res
});

const onDragStart = (e: DragEvent) => {
    if (splitMode?.value) {
        e.preventDefault();
        e.stopPropagation();
        return;
    }
    e.dataTransfer!.setData(
        "task",
        JSON.stringify({...props.task, offsetX: e.offsetX, x: e.x})
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
    (borderMovingPreviousState.value = {...props.task});
};

const onChange = (v: Task) => {
    const {
        endAt,
        startAt,
        description,
        workflowId,
        name,
        color,
    } = v;
    console.log("data to change");
    reorderTask(
        {...props.task, startAt, endAt, description, workflowId, name},
        props.task
    );
};


const applyCalendar = async (v: { calendarId: number, duration: number, task: Task }) => {
    const {calendarId, duration, task} = v;
    console.log("applyCalendar", calendarId, duration);
    await applyCalendarToTask(calendarId, duration, task);
};

const onMouseDown = (event: MouseEvent) => {
    console.log("event.button", event.button);
    if (event.button !== 2) return;
    menu.value = !menu.value;
};

const onMouseUp = async (event: MouseEvent) => {
    if (!splitMode?.value) {
        event.preventDefault();
        return;
    }
    await split(splitText.value, props.task);
};

const onContextMenu = (event: MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
};

const onMouseMove = (event: MouseEvent) => {
    if (!splitMode?.value) return;
    event.stopPropagation();
    tooltipPosition.value = {
        x: event.x + 20, // Смещение от указателя по горизонтали
        y: event.y + 20, // Смещение от указателя по вертикали
    };
    splitText.value = coordsToTime(event.offsetX + 10)?.toString() || "";
};

const coordsToTime = (x: number): Date | undefined => {
    const time = new Date(startAt.value);
    if (scale?.value === undefined) {
        console.error("scale is undefined");
        return;
    }
    const startHour = time.getHours();
    const startMinutes = time.getMinutes();
    time.setHours(
        Math.floor(startHour + x / scale.value),
        Math.floor(startMinutes + (x % scale.value) / (scale.value / 60))
    );
    return time;

};
const wfbody = ref(document.querySelector<HTMLElement>(".workflow__body"));

let last_known_scroll_position = {
    scrollLeft: 0, offsetLeft: 0
};

let ticking = false;
const moveTaskCaption = ({scrollLeft, offsetLeft}: { scrollLeft: number, offsetLeft: number }) => {
    taskCaption.value && ((scrollLeft - offsetLeft) > 0) && (taskCaption.value.style.left = `${(scrollLeft - offsetLeft)}px`);
}

const onTaskScroll = (e: WheelEvent) => {
    const {scrollLeft} = wfbody.value;
    const {offsetLeft} = element.value;

    last_known_scroll_position = {scrollLeft: scrollLeft + OFFSET, offsetLeft}
    if (!ticking) {
        window.requestAnimationFrame( ()=> {
            moveTaskCaption(last_known_scroll_position);
            ticking = false;

        });
        ticking = true;
    }

}
onMounted(() => {
    wfbody.value = document.querySelector<HTMLElement>(".workflow__body");
    wfbody.value!.addEventListener("scroll", onTaskScroll);
})

onUnmounted(() => {
    wfbody.value!.removeEventListener("scroll", onTaskScroll);
})

watch([busy], () => {
    emit("busyEvent", busy.value);
}, {immediate: true});


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
    overflow: hidden

    &__border
        width: 8px
        background-color: #000
        border-inline: 1px solid #fff
        box-shadow: 0px 0px 35px rgba(0, 0, 0, 10)
        opacity: 0
        cursor: pointer

    &:hover .task__border
        opacity: 1



    &__caption
        position: absolute
        top: 0
        //left: v-bind(OFFSET_px)
        left: 1rem
        flex: 1
        //display: grid
        //place-items: center

        & > *
            width: fit-content


</style>
