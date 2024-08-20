<template lang="pug">
    v-container
        v-row.ga-2(justify="space-between")
            v-card.pa-2
                label(for="computedStartAt")
                    div Время начала
                    input(type="datetime-local" v-model="computedStartAt" id="computedStartAt")
            v-card.pa-2
                label(for="computedУтвAt")
                    div Время завершения
                    input(type="datetime-local" v-model="computedEndAt" id="computedEndAt")

</template>

<script setup lang="ts">
import { computed } from "vue";
import { useToast } from "vue-toast-notification";

const toast = useToast();
const startAt = defineModel<string>("startAt", { required: true });
const endAt = defineModel<string>("endAt", { required: true });

const timeStartAt = computed(() => new Date(startAt.value).getTime());
const timeEndAt = computed(() => new Date(endAt.value).getTime());

const computedStartAt = computed({
    get: () => {
        const date = new Date(startAt.value?.toString());
        const offset = date.getTimezoneOffset() * 60 * 1000;
        return new Date(date.getTime() - offset).toISOString().slice(0, 16);
    },
    set: (value: string) => {
        const date = new Date(value);
        //--- validation ---
        if (timeEndAt.value < date.getTime())
            return toast.error("Время начала больше времени завершения");
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
        //--- validation ---
        if (timeStartAt.value > date.getTime())
            return toast.error("Время завершения меньше времени начала");
        const offset = date.getTimezoneOffset() * 60 * 1000;
        endAt.value = new Date(date.getTime() - offset)
            .toISOString()
            .slice(0, 16);
    },
});
</script>

<style scoped lang="sass"></style>
