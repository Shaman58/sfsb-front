<template lang="pug">
    .workflow
        .workflow__header
            .workflow__scale
                v-slider(v-model="scale" label="Масштаб" track-color="green" min="10" max="200" )
            .div {{scrollBody}}
        .workflow__body(ref="workflowBody" @scroll="onScroll")
            .workflow__days
                Day(:line-width="scale" ref="daysElement")
            .workflow__resources(:style="{width: daysElement?.dayContainer.getBoundingClientRect().width+'px'}")
                Resource(v-for="resource in resources" :key="resource.id" :resource)

            .workflow__now
        .workflow__footer
            .workflow__stat Общее количество ресурсов: {{resources.length}}
            .workflow__stat Общее количество задач: {{getAllTasks.length}}
</template>

<script setup lang="ts">
import { onMounted, provide, ref } from "vue";
import Day from "@/components/workflow/Day.vue";
import Resource from "@/components/workflow/ResourceComponent.vue";
import { useWorkflow } from "@/pinia-store/workflow";
import { storeToRefs } from "pinia";
import useTaskMoving from "@/pinia-store/taskMoving";

const tasks = ref(Array.from({ length: 4 }));
const scale = ref(60);
const daysElement = ref<Day>();
const workflowBody = ref<HTMLElement>();
const { resources, getResources } = useWorkflow();
const { getAllTasks } = storeToRefs(useWorkflow());

const { scrollBody } = storeToRefs(useTaskMoving());
provide("scale", scale);

const onScroll = () => {
    scrollBody.value = workflowBody.value?.scrollLeft || 0;
};
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
        overflow: auto

    &__header
        padding-block: 8px

    &__days
        height: 100%

    &__scale
        max-width: 300px

    &__resources
        position: absolute
        top: 2rem
        left: 0
        width: 100%
</style>
