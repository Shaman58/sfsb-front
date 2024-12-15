<template lang="pug">
    .calendar
        .calendar__header
            v-card
                v-toolbar(color="purple-darken-4" dark flat)
                    v-toolbar-title Название календаря и его описание
                v-card.w-100.d-flex.ga-2.pa-2
                    v-card.w-100
                        v-text-field(hide-details="auto" label="Название" v-model="title" )
                    v-card.w-100
                        v-text-field(hide-details="auto" label="Описание" v-model="description" )
        .calendar__calendar
            v-card.w-100
                v-toolbar(color="deep-orange lighten-2" dark flat)
                    v-toolbar-title Праздничные дни
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
            v-card.w-100
                v-toolbar(color="brown-darken-4" dark flat)
                    v-toolbar-title Рабочее время
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
                v-toolbar(color="purple-lighten-3" dark flat)
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
import {ref, watch, onMounted, computed, toValue} from "vue";
import {useRoute} from "vue-router";
import {useCalendars} from "@/pinia-store/calendar";

function getDatesForWeekday(year: number, weekday:number ) {
    const dates = [];
    let date = new Date(year, 0, 1); // Начало года

    // Найти первую указанную дату дня недели
    date.setDate(date.getDate() + ((weekday - date.getDay() + 7) % 7));

    // Добавить все даты указанного дня недели в массив
    while (date.getFullYear() === year) {
        dates.push(new Date(date));
        date.setDate(date.getDate() + 7); // Переход к следующей неделе
    }

    return dates;
}

const saturdays2024 = getDatesForWeekday(2024, 6); // 6 - Суббота
const sunday2024 = getDatesForWeekday(2024, 7);

const date = ref([new Date(2024, 11, 15), new Date(2024, 11, 11)]);

const {getCalendarById} = useCalendars();
const data = ref<Calendar | undefined>(),
    timeBegin = ref<string | undefined>(),
    timeEnd = ref<string | undefined>(),
    calendar = ref(),
    title = ref<string | undefined>(),
    description = ref<string | undefined>(),
    weekends = ref<(string|null)[]>([]),
    menu2 = ref(false),
    menu3 = ref(false),
    dates = ref<Date[]>([new Date('2024-12-01'), new Date('2024-12-05')]);

const forAttributesDates = computed(() => [
    weekends.value.includes('SATURDAY') ? saturdays2024 :[],
    weekends.value.includes('SUNDAY')?sunday2024:[]
].flat())

const attributesCalendar = computed(() => [
    {
        highlight: true,
        dates: dates.value,
    },
    {
        highlight: {
            color: 'purple',
            fillMode: 'light',
        },
        dates: forAttributesDates.value,
    },

])


const dayClick = (day) => {
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
      beginWatch: toValue(timeBegin.value)||'',
      endWatch: toValue(timeEnd.value)||'',
      calendarName: toValue(title.value)||'',
      description: toValue(description.value)||'',
      holyDays: attributesCalendar.value[0].dates.map(e=>new Date(e).toISOString().split('T')[0])||[],
      id: 0,
      weekEnds: toValue(weekends.value)||[],
  }
  console.log(dataToSend);
}


const route = useRoute();
watch(() => route.params.id, async (newId: string) => {
    if (!newId || newId==='new') {
        reset();
        return;
    };
    data.value = await getCalendarById(+newId);
    dates.value = data.value?.holyDays.map(e=>new Date(e))||([] as Date[]);
    timeBegin.value = data.value?.beginWatch
    timeEnd.value = data.value?.endWatch;
    title.value = data.value?.calendarName;
    description.value = data.value?.description||'';
    weekends.value = data.value?.weekEnds||[];
}, {immediate: true});
watch(() => weekends.value, () => {
    console.log(weekends.value);
})

</script>

<style scoped lang="sass">
.vc-highlight[data-key='saturdays']
    background-color: lightblue
    border-radius: 50%

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
