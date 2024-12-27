<template lang="pug">
    v-dialog(max-width="500")
        template(v-slot:activator="{ props: activatorProps }")
            v-btn(
                v-bind="activatorProps"
                color="surface-variant"
                text="Добавить технологию"
                variant="flat")

        template(v-slot:default="{ isActive }")
            v-card.card(title="Добавление технологии")
                v-form.form
                    v-text-field(v-model="technologyName" label="Название")

                    v-text-field(v-model="orderNumber" label="Номер заказа")
                    v-card.selected.pa-4(variant="outlined" )
                        v-row.ga-2
                            v-col.pa-0.pt-2
                                v-text-field( v-model="currentName" label="Название" hide-details)
                            v-col.pa-0.pt-2
                                v-text-field( v-model="duration" type="number" min="0" label="Продолжительность, час" hide-details)

                        v-row.ga-2
                            v-col.pa-0.pt-2
                                v-select(
                                    hide-details
                                    v-model="calendarId"
                                    label="Календарь"
                                    :items="calendars"
                                    item-title="calendarName"
                                    item-value="id"
                                )
                            v-col.pa-0.pt-2
                                v-select(
                                    hide-details
                                    v-model="selectedResource"
                                    label="Ресурс"
                                    :items="resources"
                                    item-title="name"
                                    item-value="id"
                                )
                        v-row.ga-2
                            v-col.pa-0.pt-2
                                v-card.mb-2
                                    //v-toolbar(color="purple-lighten-3" dark flat)
                                    //    v-toolbar-title Время начала
                                    v-card.pa-2
                                        v-card-subtitle Время начала
                                        label
                                            input.w-100(type="datetime-local" v-model="start")
                        v-card-actions
                            v-btn.flex-1-1.mt-4(@click="addSelectedItem" prepend-icon="mdi-plus-circle-outline") Добавить пункт
                ul.list
                    li.item(v-for="(item, index) in selectedItems" :key="index")
                        v-icon(@click="removeSelectedItem(item)" icon="$close")
                        span {{ item.name}} ({{`${item.duration} ${item.start} "${getCalendarById(item.calendarId).calendarName}" "${getResourceById(item.workflowId).name}"`}})


                v-card-actions
                    v-spacer

                    v-btn(text="Добавить" color="orange" @click="onAdd(isActive)")
                    v-btn(text="Закрыть" @click="isActive.value = false")
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useOrdersInWorkflow } from "@/pinia-store/ordersInWorkflow";
import {computed, onMounted, type Ref, ref, toRaw, toValue} from "vue";
import { useToast } from "vue-toast-notification";
import { useWorkflow } from "@/pinia-store/workflow";
import {useCalendars} from "@/pinia-store/calendar";



const toast = useToast();

const { operations } = storeToRefs(useOrdersInWorkflow());
const { getOperations } = useOrdersInWorkflow();
const { addTaskManual, getResources } = useWorkflow();
const { resources } = storeToRefs( useWorkflow());

const selectedResource = ref<number|undefined>();
const getResourceById = (id: number) => resources.value && (resources.value as Resource[]).find((resource) => resource.id === id);

const technologyName = ref("");

const currentOperation = ref("");
const currentName = ref("");
const orderNumber = ref<string | null>(null);

const duration = ref();

const start = ref<string>(new Date().toISOString());
const startMenu = ref(false);

const calendarId = ref<number|undefined>();
const {calendars} = storeToRefs(useCalendars())
const {getCalendars} = useCalendars()

const getCalendarById = (id: number) => calendars.value && (calendars.value as Calendar[]).find((c: Calendar)=>c.id===id)

const selectedItems: Ref<(ItemTech)[]> = ref([]);



const onAdd = async (isActive: Ref<boolean>) => {
    if (!technologyName.value)
        return toast.error("Вы забыли назвать технологию");
    if (!selectedItems.value.length)
        return toast.error("Список пуст");

    const tasks = [...selectedItems.value.map(task => toRaw(task))];
    const res: CreateManualTechnology = {
        name: technologyName.value,
        tasks,
        orderNumber: orderNumber.value,
    };
    await addTaskManual(res);
    isActive.value = false;
    await getResources();
};

const addSelectedItem = () => {
    if (!currentName.value)
        return toast.error("Вы не указали название");
    if (!selectedResource.value)
        return toast.error("Вы забыли выбрать ресурс");
    const item : ItemTech= {
        name: currentName.value||"",
        duration: duration.value||0,
        start: start.value.toLocaleString()||"",
        calendarId: calendarId.value || -1,
        workflowId: selectedResource.value || -1,
    };
    selectedItems.value.push({...item});
    // currentOperation.value = "";
    currentName.value = "";
    duration.value = 0;
};

const removeSelectedItem = (item: ItemTech) => {
    selectedItems.value = selectedItems.value.filter(
        (e) => e.name !== item.name
    );
};



onMounted(async () => {
    if (!operations.value.length) {
        await getOperations();
    }
    if(!calendars.value.length) {
        await getCalendars();
        calendarId.value = calendars.value[0].id
    }
    start.value = (new Date(new Date().getTime() - new Date(new Date().getTimezoneOffset()*60000).getTime())).toISOString().replace(/\.\d+Z$/,"");
});
</script>

<style scoped lang="sass">
.item, .v-list-item__content
    display: flex
    align-items: center
    gap: 1rem

.list
    height: 150px
    overflow-y: auto
    border-radius: 12px
    border: 1px solid #ccc

.item
    padding: 0.5rem

    &:nth-child(odd)
        background: #ccc


.card
    padding: 0.5rem
</style>
