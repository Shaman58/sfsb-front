<template lang="pug">
    .calendar
        .calendar__header
            v-card.w-100.d-flex.ga-2.pa-2
                v-card.w-100
                    v-text-field(hide-details="auto" label="Название" v-model="title" )
                v-card.w-100
                    v-text-field(hide-details="auto" label="Описание" v-model="description" )
        .calendar__calendar
            v-card.w-100
                VCalendar(
                    ref="calendar"
                    :attributes="attributesCalendar"
                    :rows="2"
                    :columns="6"
                    :step="1"
                    mode="multiple"
                    @dayclick="dayClick"
                )
        .calendar__pickers
            //v-card.w-100.d-flex.flex-column.ga-2
            //    v-time-picker(title="Начало смены" v-model="timeBegin" format="24hr")
            //    v-time-picker(title="Конец смены" v-model="timeEnd" format="24hr")
            v-container
                v-row.ga-2
                    v-card.flex-fill.pa-3
                        v-text-field(v-model='timeBegin'
                            :active='menu2'
                            :focus='menu2'
                            label='Начало смены'
                            prepend-icon='mdi-clock-time-four-outline'
                            readonly=''
                            hide-details
                        )
                            v-menu(v-model='menu2' :close-on-content-click='false' activator='parent' transition='scale-transition')
                                v-time-picker(v-if='menu2' v-model='timeBegin' full-width='' format="24hr" )
                    v-card.flex-fill.pa-3
                        v-text-field(v-model='timeEnd'
                            :active='menu3'
                            :focus='menu3'
                            label='Конец смены'
                            prepend-icon='mdi-clock-time-four-outline'
                            readonly=''
                            hide-details
                        )
                            v-menu(v-model='menu3' :close-on-content-click='false' activator='parent' transition='scale-transition')
                                v-time-picker(v-if='menu3' v-model='timeEnd' full-width='' format="24hr")

        .calendar__weekends
            v-card.w-100
                v-toolbar(color="blue-grey" dark flat)
                    v-toolbar-title Выходные дни
                div.d-flex.align-center.ga-2.pa-2
                    v-switch( color="blue" label="Суббота" value="SATURDAY" v-model="weekends" hide-details)
                    v-switch( color="blue" label="Воскресенье" value="SUNDAY" v-model="weekends" hide-details)
        .calendar__controls
            v-card.w-100.d-flex.ga-2.pa-2.align-center
                v-btn.btn( variant="tonal" color="red" @click="save()") Сохранить
                v-btn.btn(variant="tonal" @click="reset()") Сбросить
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
    weekends = ref<string []>([]),
    menu2 = ref(false),
    menu3 = ref(false);


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

const reset=()=>{
    attributesCalendar.value[0].dates = [];
    timeBegin.value = ''
    timeEnd.value = '';
    title.value = '';
    description.value = '';
    weekends.value = [];
}

const save = () => {
  const dataToSend:Calendar = {
      calendarName: title.value,
      description: description.value,
      weekends: weekends.value,
      holyDays: attributesCalendar.value[0].dates,
      beginWatch: timeBegin.value,
      endWatch: timeEnd.value,
      weekEnds: weekends.value,
  }
  console.log(dataToSend);
}


const route = useRoute();
watch(() => route.params.id, async (newId) => {
    if (!newId || newId==='new') {
        reset();
        return;
    };
    data.value = await getCalendarById(newId);
    attributesCalendar.value[0].dates = data.value?.holyDays;
    timeBegin.value = data.value?.beginWatch
    timeEnd.value = data.value?.endWatch;
    title.value = data.value?.calendarName;
    description.value = data.value?.calendarDescription;
    weekends.value = data.value?.weekEnds;
}, {immediate: true});
watch(() => weekends.value, () => {
    console.log(weekends.value);
})

</script>

<style scoped lang="sass">
.calendar
    box-sizing: border-box
    padding: 1rem
    display: grid
    grid-template-columns: 1fr
    gap: .5rem

    &__header
        position: sticky
        top: 0
        z-index: 1

    &__weekends
        display: flex
        justify-content: space-evenly

    :deep(.vc-pane-layout)
        grid-template-columns: repeat(auto-fit, minmax(230px, 1fr)) !important
    :deep(.vc-container)
        width: 100%

</style>
