<template lang="pug">
    .workflow
        .workflow__header
            .workflow__scale
                v-slider(v-model="scale" label="Масштаб" track-color="green")
        .workflow__body
            .workflow__timeline
                TimeLineComponent(:line-width="scale")
                ResourceComponent(v-for="resource in resources" :key="resource.id" :resource)

            .workflow__now
        .workflow__footer
            .workflow__stat Общее количество ресурсов: {{resources.length}}
            .workflow__stat Общее количество задач: {{getAllTasks.length}}
</template>

<script setup lang="ts">
import { onMounted, provide, ref } from "vue";
import TimeLineComponent from "@/components/workflow/TimeLineComponent.vue";
import ResourceComponent from "@/components/workflow/ResourceComponent.vue";
import { useWorkflow } from "@/pinia-store/workflow";
import { storeToRefs } from "pinia";

const tasks = ref(Array.from({ length: 4 }));
const scale = ref(30);
const { resources, getResources } = useWorkflow();
const { getAllTasks } = storeToRefs(useWorkflow());
provide("scale", scale);

onMounted(() => getResources());
</script>

<style scoped lang="sass">
.workflow
    background-color: #ddd
    width: 100vw
    margin-top: 8px
    height: calc(100vh - 2.5rem)
    overflow: auto
    display: grid
    grid-template-rows: 80px 1fr 50px

    &__body
        position: relative

    &__header
        padding-block: 8px

    &__timeline
        height: 100%
        width: 100%
        position: absolute
        top: 0
        left: 0
        overflow: auto

    &__scale
        max-width: 300px
</style>
