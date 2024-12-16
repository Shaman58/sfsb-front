<template lang="pug">
    .workflow
        .workflow__header
            div
                button(@click="getResources") Обновить
            .workflow__scale
                v-slider(v-model="scale" label="Масштаб" track-color="green" min="10" max="200" )
            AddResource(:items="operations")
            AddTechnology(:items="[1,2,3,4,5]")

            v-btn(
                :color="splitMode? 'red' : 'surface-variant'"
                :text="splitMode ?'Разделение...' : 'Разделить технологию'"
                variant="flat"
                @click="splitMode = !splitMode"
            )
                v-icon(v-if="splitMode" color="black" icon="mdi-arrow-split-vertical" size="large" title="Разделить")
                v-icon(v-else color="white" icon="mdi-arrow-split-vertical" size="large" title="Разделить")

            v-btn(
                :color="watchNowMode? 'red' : 'surface-variant'"
                :text="''"
                variant="flat"
                @click="watchNowMode = !watchNowMode"
            )
                v-icon(v-if="watchNowMode" color="black" icon="mdi-clock" size="large" title="Разделить")
                v-icon(v-else color="white" icon="mdi-clock" size="large" title="Разделить")

            v-btn(
                :color="'surface-variant'"
                :text="'Календари'"
                variant="flat"
                @click="router.push('/calendars')"
            ) Календари

            //v-btn(color="primary" @click="gotoCurrentHour") Текущий час
        .workflow__body(ref="workflowBody" @scroll="onScroll")
            .workflow__days(ref="daysListElement" :style="{height: containerHeight+'px'}")
                Day( v-for="day in getDaysRange" :key="day" :line-width="scale" :day ref="daysElement")
            .workflow__resources(ref = "resourceListElement" :style="{width: '100%'}")
                Resource(v-for="resource in resources" :key="resource" :resource :overallWidth @resourcemenu="onResourceMenu")

            .workflow__now
        .workflow__footer
            .workflow__stat Общее количество ресурсов: {{resources.length}}
            .workflow__stat Общее количество задач: {{getAllTasks.length}}
        ResourceInfo(v-model:menu="resourcemenu", :resource="currentResource")
</template>

<script setup lang="ts">
import {nextTick, onMounted, onUnmounted, provide, ref, watch, watchEffect} from "vue";
import Day from "@/components/workflow/Day.vue";
import Resource from "@/components/workflow/ResourceComponent.vue";
import { useWorkflow } from "@/pinia-store/workflow";
import { storeToRefs } from "pinia";
import useTaskMoving from "@/pinia-store/taskMoving";
import ResourceInfo from "@/components/workflow/ResourceInfo.vue";
import AddResource from "@/components/workflow/AddResource.vue";
import { useOrdersInWorkflow } from "@/pinia-store/ordersInWorkflow";
import AddTechnology from "@/components/workflow/AddTechnology.vue";
import {useRouter} from "vue-router";

type DayType = typeof Day;

const router =useRouter();

const tasks = ref(Array.from({ length: 4 }));
const scale = ref(60); // масштаб px/час
const overallWidth = ref(window.innerWidth);
const daysElement = ref<DayType[]>();
const workflowBody = ref<HTMLElement>();
const { resources, getAllTasks, getFirstTask, getLastTask, getDaysRange } =
    storeToRefs(useWorkflow());
const { getResources } = useWorkflow();

const { operations } = storeToRefs(useOrdersInWorkflow());
const { getOperations } = useOrdersInWorkflow();

const resourcemenu = ref(false);
const currentResource = ref<Resource | undefined>();

const { taskMoving } = storeToRefs(useTaskMoving());

const { scrollBody } = storeToRefs(useTaskMoving());
provide("scale", scale);

const daysListElement = ref<HTMLElement>();
const resourceListElement = ref<HTMLElement>();
const containerHeight = ref<number | undefined>();

const splitMode = ref(false);
provide("splitMode", splitMode);

const handleResize = () => {
    containerHeight.value =
        resourceListElement.value?.getBoundingClientRect().height;
};

const onScroll = () => {
    scrollBody.value = workflowBody.value?.scrollLeft || 0;
};
const refreshOverallWidth = () => {
    if (!daysElement.value || daysElement.value?.length === 0) return;
    overallWidth.value = ([...daysElement.value]).reduce(
        (acc, cur) => {
            acc += cur.dayContainer.getBoundingClientRect().width;
            return acc;
        },
        0
    ) as number;
};

const gotoCurrentHour = () => {
    const currentHourElement = document.querySelector(".hour-line.current-day");
    currentHourElement?.scrollIntoView({
        behavior: "smooth",
        inline: "center",
    });
};

const watchNowMode = ref(false)
const int = ref();
onMounted(async () => {
    await getResources();
    await nextTick();
    refreshOverallWidth();
    if (!operations.value || operations.value.length === 0)
        await getOperations();

    window.addEventListener("resize", handleResize);
    window.addEventListener("wheel", handleResize);
    handleResize();

    int.value = setInterval(() => {
        watchNowMode.value && gotoCurrentHour();
    },2000);

});

onUnmounted(() => {
    window.removeEventListener("resize", handleResize);
    window.removeEventListener("wheel", handleResize);

    clearInterval(int.value);
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

watchEffect(()=>console.log("getDaysRange", getDaysRange.value.map(x=>x.toISOString())));
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
        gap: 8px
        align-items: center

    &__days
        height: 100%
        display: flex
        position: absolute
        bottom: 0
        left: 0
        right: 0
        top: 0
        width: 100%

    &__day
        height: 100%


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
