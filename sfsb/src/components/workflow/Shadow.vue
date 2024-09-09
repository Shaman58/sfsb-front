<template lang="pug">
    .shadow(
        v-show="activeResource === resourceId && (taskMoving || borderMoving)"
        :style="{left: x + 'px', width: width + 'px'}"
    )
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import useTaskMoving from "@/pinia-store/taskMoving";
import { computed, inject } from "vue";

const props = defineProps<{ resourceId: number }>();

const { taskMoving, borderMoving, activeResource } = storeToRefs(
    useTaskMoving()
);
const { scrollBody } = storeToRefs(useTaskMoving());

const scale = inject("scale");

const width = computed(() => {
    if (borderMoving.value) {
        const startTime = new Date(borderMoving.value.startAt).getTime();
        const endTime = new Date(borderMoving.value.endAt).getTime();
        const res = ((endTime - startTime) / 3600000) * scale.value;
        return res;
    }
    if (taskMoving.value) {
        const startTime = new Date(taskMoving.value.startAt).getTime();
        const endTime = new Date(taskMoving.value.endAt).getTime();
        const res = ((endTime - startTime) / 3600000) * scale.value;
        return res;
    }
    return 0;
});
const x = computed(() => {
    if (taskMoving.value && taskMoving.value.x) return taskMoving.value.x;
    if (borderMoving.value && borderMoving.value.x) {
        return borderMoving.value.border === "left"
            ? borderMoving.value.x + scrollBody.value
            : borderMoving.value.x - width.value + scrollBody.value;
    }
    return 0;
});
</script>

<style scoped lang="sass">
.shadow
    height: 100%
    width: 100px
    opacity: 0.5
    position: absolute
    top: 0
    left: 0

    background-color: #77f7
</style>
