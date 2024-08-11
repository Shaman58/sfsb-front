<template lang="pug">
    .cell-component
        pre {{props.id}} {{taskId}}
</template>

<script setup lang="ts">
import { type Ref, ref } from "vue";

const props = defineProps<{ id: number }>();
const taskId: Ref<number | null> = ref(null);

const setTaskId = (id: number | null) => {
    return new Promise((resolve, reject) => {
        if (taskId.value !== null && id !== taskId.value)
            reject(`Task ID = ${id} in ${props.id} already exists`);
        taskId.value = id;
        resolve();
    });
};
const clear = () => {
    taskId.value = null;
};

defineExpose({
    setTaskId,
    clear,
});
</script>

<style scoped lang="sass">
.cell-component
    display: grid
    place-items: center
    border-radius: 5px
    border: 1px solid #7777
    font-size: 10px
</style>
