<template lang="pug">
    v-container
        v-row(justify="space-around")
            input(type="datetime-local" v-model="computedStartAt")
            input(type="datetime-local" v-model="computedEndAt")

</template>

<script setup lang="ts">
import { computed } from "vue";

const startAt = defineModel<string>("startAt", { required: true });
const endAt = defineModel<string>("endAt", { required: true });
const computedStartAt = computed({
    get: () => {
        const date = new Date(startAt.value?.toString());
        const offset = date.getTimezoneOffset() * 60 * 1000;
        return new Date(date.getTime() - offset).toISOString().slice(0, 16);
    },
    set: (value: string) => {
        const date = new Date(value);
        const offset = date.getTimezoneOffset() * 60 * 1000;
        startAt.value = new Date(date.getTime() - offset)
            .toISOString()
            .slice(0, 16);
    },
});
const computedEndAt = computed({
    get: () => {
        const date = new Date(endAt.value?.toString());
        const offset = date.getTimezoneOffset() * 60 * 1000;
        return new Date(date.getTime() - offset).toISOString().slice(0, 16);
    },
    set: (value: string) => {
        const date = new Date(value);
        const offset = date.getTimezoneOffset() * 60 * 1000;
        endAt.value = new Date(date.getTime() - offset)
            .toISOString()
            .slice(0, 16);
    },
});
</script>

<style scoped lang="sass"></style>
