<template lang="pug">
    v-container
        v-row.ga-2(justify="space-between")
            v-card.pa-2
                label(for="computedStartAt")
                    div Время начала
                    input(type="datetime-local" :value="startAtLocal" @change="startAt = $event.target.value" id="computedStartAt")
            v-card.pa-2
                label(for="computedEndAt")
                    div Время завершения
                    input(type="datetime-local" :value="endAtLocal" @change="endAt = $event.target.value" id="computedEndAt")
                    //input(type="datetime-local" v-model="endAt" id="computedEndAt")
</template>

<script setup lang="ts">
import { computed } from "vue";

const startAt = defineModel<string>("startAt", {
    required: true,
});
const endAt = defineModel<string>("endAt", {
    required: true,
});

const toLocaleDate = (value: string | Date) => {
    const offset = new Date().getTimezoneOffset() * 60000;
    const date = new Date(new Date(value).getTime() - offset)
        .toISOString()
        .slice(0, -1);
    return date;
};
const startAtLocal = computed(() => toLocaleDate(startAt.value));
const endAtLocal = computed(() => toLocaleDate(endAt.value));
</script>

<style scoped lang="sass"></style>
