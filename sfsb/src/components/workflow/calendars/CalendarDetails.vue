<template lang="pug">
    .calendar
        .calendar__header
            v-container
                div
                    v-text-field(hide-details="auto" label="Название" v-model="title" )
                    v-text-field(hide-details="auto" label="Описание" v-model="description" )
        .calendar__calendar
            v-container
                VCalendar(
                    ref="calendar"
                    :attributes="attributesCalendar"
                    :rows="3"
                    :columns="4"
                    :step="1"
                    :min-date="startDate"
                    mode="multiple"
                    @dayclick="dayClick"
                )
        .calendar__pickers
            v-container
                v-time-picker(title="Выберите время" v-model="timeBegin" format="24hr")
                v-time-picker(title="Выберите время" v-model="timeEnd" format="24hr")
                pre {{ data }}
        .calendar__weekends
            v-container.d-flex(justify="space-evenly")
                v-checkbox( label="Суббота" value="SATURDAY" v-model="weekends" )
                v-checkbox( label="Воскресенье" value="SUNDAY" v-model="weekends" )
        .calendar__controls
            v-container
                v-btn(color="primary" @click="save") Сохранить
                v-btn(color="secondary" @click="reset") Отменить
</template>

<script setup lang="ts">
import {ref, watch, onMounted, computed} from "vue";
import {useRoute} from "vue-router";
import {useCalendars} from "@/pinia-store/calendar";

const attributesCalendar = ref([
    {
        highlight: true,
        dates: [new Date('2024-12-01'), new Date('2024-12-05')],
    },
])
const date = ref([new Date(2024, 11, 15), new Date(2024, 11, 11)]);

const {getCalendarById} = useCalendars();
const data = ref<Calendar | undefined>(),
    timeBegin = ref<string | undefined>(),
    timeEnd = ref<string | undefined>(),
    calendar = ref(),
    title = ref<string | undefined>(),
    description = ref<string | undefined>(),
    weekends = ref<(string | null)[]>([]);


const dayClick = (day: CalendarDay) => {
    console.log(day);
    attributesCalendar.value[0].dates.push(day.id);
}
const log = (e: any) => {
    console.log('log', e);
}

onMounted(async () => {
    await calendar.value.move({month: 1, year: new Date().getFullYear()})
})


const route = useRoute();
watch(() => route.params.id, async (newId) => {
    data.value = await getCalendarById(newId);
    attributesCalendar.value[0].dates = data.value?.holyDays;
    timeBegin.value = data.value?.beginWatch
    timeEnd.value = data.value?.endWatch;
    title.value = data.value?.calendarName;
    description.value = data.value?.calendarDescription;
}, {immediate: true});
watch(() => calendar.value, () => {
    console.log(attributesCalendar.value);
})

</script>

<style scoped lang="sass">
.calendar
    display: grid
    grid-template-columns: 2fr 1fr
    grid-template-areas: "header header" "calendar pickers" "weekends pickers" "controls controls"

    &__header
        grid-area: header

    &__calendar
        grid-area: calendar

    &__pickers
        grid-area: pickers

    &__weekends
        grid-area: weekends
        display: flex
        justify-content: space-evenly

    &__controls
        grid-area: controls
</style>
