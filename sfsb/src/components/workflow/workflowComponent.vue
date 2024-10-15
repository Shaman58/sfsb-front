<template lang="pug">
    .workflow
        .workflow__header
            div {{taskMoving}}
            div
                button(@click="getResources") Обновить
            .workflow__scale
                v-slider(v-model="scale" label="Масштаб" track-color="green" min="10" max="200" )
            AddResource(:items="operations")
        .workflow__body(ref="workflowBody" @scroll="onScroll")
            .workflow__days
                Day( v-for="day in getDaysRange" :key="day" :line-width="scale" :day ref="daysElement")
            .workflow__resources(:style="{width: '100%'}")
                Resource(v-for="resource in resources" :key="resource" :resource :overallWidth @resourcemenu="onResourceMenu")

            .workflow__now
        .workflow__footer
            .workflow__stat Общее количество ресурсов: {{resources.length}}
            .workflow__stat Общее количество задач: {{getAllTasks.length}}
        ResourceInfo(v-model:menu="resourcemenu", :resource="currentResource")
</template>

<script setup lang="ts">
import { nextTick, onMounted, provide, ref, watch } from "vue";
import Day from "@/components/workflow/Day.vue";
import Resource from "@/components/workflow/ResourceComponent.vue";
import { useWorkflow } from "@/pinia-store/workflow";
import { storeToRefs } from "pinia";
import useTaskMoving from "@/pinia-store/taskMoving";
import ResourceInfo from "@/components/workflow/ResourceInfo.vue";
import AddResource from "@/components/workflow/AddResource.vue";
import { useOrdersInWorkflow } from "@/pinia-store/ordersInWorkflow";

const tasks = ref(Array.from({ length: 4 }));
const scale = ref(60);
const overallWidth = ref(window.innerWidth);
const daysElement = ref<Day[]>();
const workflowBody = ref<HTMLElement>();
const { resources, getAllTasks, getFirstTask, getLastTask, getDaysRange } =
    storeToRefs(useWorkflow());
const { getResources } = useWorkflow();

const { operations } = storeToRefs(useOrdersInWorkflow());
const { getOperations } = useOrdersInWorkflow();

const resourcemenu = ref(false);
const currentResource = ref<Resource>();

const { taskMoving } = storeToRefs(useTaskMoving());

const { scrollBody } = storeToRefs(useTaskMoving());
provide("scale", scale);

const onScroll = () => {
    scrollBody.value = workflowBody.value?.scrollLeft || 0;
};
const refreshOverallWidth = () => {
    if (!daysElement.value || daysElement.value?.length === 0) return;
    overallWidth.value = ([...daysElement.value] as Day[]).reduce(
        (acc: Day, cur: Day) => {
            acc += cur.dayContainer.getBoundingClientRect().width;
            return acc;
        },
        0
    ) as number;
};
onMounted(async () => {
    await getResources();
    await nextTick();
    refreshOverallWidth();
    if (!operations.value || operations.value.length === 0)
        await getOperations();
});
watch(
    [scale],
    async () => {
        await nextTick();
        refreshOverallWidth();
    },
    { immediate: true }
);
watch([getAllTasks], () => {
    console.log("getAllTasks", getAllTasks.value);
});
watch(
    () => resources,
    () => {
        console.log("resources", resources.value);
    },
    { immediate: true }
);

const onResourceMenu = (event: Resource) => {
    resourcemenu.value = true;
    currentResource.value = event;
};
</script>

<style lang="sass">
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
        display: flex
        align-items: center

    &__days
        height: 100%
        display: flex

    &__scale
        width: 300px

        & > .v-input > .v-input__details
            display: none

    &__resources
        position: absolute
        top: 3rem
        left: 0
        width: 100%

.v-slider .v-input__details
    display: none
</style>
