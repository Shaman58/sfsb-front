<template lang="pug">
    v-menu.menu(
        v-model="menu"
        :close-on-content-click="false"
        location="end"
        scroll-strategy="reposition"
        transition="slide-y-transition"
        @contextmenu.stop.prevent="()=>{}"
        :style="{left: '50%', translate: '-50% 0', maxWidth: '600px'}"
    )
        v-card.pa-2()
            h3.menu__header
                span(v-if="!showEditName" @click="changeName") {{localTask.name}}
                v-text-field(v-if="showEditName" label="Название" v-model.lazy="localTask.name")

            v-form
                v-text-field(label="Описание" v-model.lazy="localTask.description")

                v-switch(color="blue" v-model="switchControl" :label="switchControl ?  'Календарь':'Обычное поведение' ")
                .d-flex.justify-center.ga-2.mb-2(v-if="switchControl")
                    v-card.flex-1-1-0.pa-3
                        v-text-field.mb-2(label="Часы:" v-model="hours" type="number" min="0" hide-details)
                        v-text-field(label="Минуты:" v-model="minutes" type="number" min="0" hide-details)
                    v-card.flex-1-1-0.pa-3
                        v-select(label="Календари" v-model="calendarId" :items="calendars" hide-details item-title="calendarName" item-value="id")
                            template(v-slot:item="{ props, item }")
                                v-list-item(v-bind="props" :subtitle="item.calendarName")


                SetTime(v-model:start-at="localTask.startAt" v-model:end-at="localTask.endAt")
                RepalceToResource(v-model:resourceId="localTask.workflowId")
            .d-flex.justify-center
                v-btn-group
                    v-btn.flex-grow-1(color="orange-darken-1" @click="onTaskChange") Изменить
                    v-btn.flex-grow-1(color="black" @click="dialog=true") Удалить
                    v-btn.flex-grow-1(color="grey-lighten-3" @click="menu=false") Отмена
            .footer
                div Технология: &nbsp;
                    strong {{task.technology}}
                div Операция: &nbsp;
                    strong {{task.operation}}

    v-dialog(v-model='dialog' max-width='420' persistent='')
        v-card(text='Вы подтверждаете удаление задачи?' title="Данная задача будет удалена.")
            template(v-slot:actions='')
                v-spacer
                v-btn(@click='onTaskDelete')
                    | ДА
                v-btn(@click='dialog = false')
                    | НЕТ
</template>

<script setup lang="ts">
import { type ModelRef, ref, toRefs, watch } from "vue";
import SetTime from "@/components/workflow/SetTime.vue";
import RepalceToResource from "@/components/workflow/RepalceToResource.vue";
import { useWorkflow } from "@/pinia-store/workflow";
import {storeToRefs} from "pinia";
import {useCalendars} from "@/pinia-store/calendar";
import {useToast} from "vue-toast-notification";

const toast = useToast();

const menu = defineModel<boolean>("menu");
const task: ModelRef<Task, string> = defineModel<Task>("task", {
    required: true,
});
const emit = defineEmits(["change","applyCalendar"]);

const dialog = ref(false);

const showEditName = ref(false);

const { startAt, endAt } = toRefs(task.value);
const localTask = ref<Task>({ ...task.value } as Task);

const { deleteTask } = useWorkflow();
const {calendars} = storeToRefs(useCalendars())
const {getCalendars} = useCalendars()
const calendarId = ref();

const switchControl = ref(false);
const durationMenu = ref(false);
const duration = ref('');

const hours = ref(0);
const minutes = ref(0);
const onTaskChange = () => {
    if(switchControl.value && !calendarId.value) return toast.error("Выберите календарь");
    switchControl.value
        ?emit("applyCalendar", {
            calendarId: calendarId.value,
            duration:timeToMinutes(`${hours.value}:${minutes.value}`),
            task: localTask.value
        })
        :emit("change", localTask.value);
    menu.value = false;
};

const onTaskDelete = async () => {
    dialog.value = false;
    await deleteTask(localTask.value.id);
    menu.value = false;
};

const changeName = () => {
    showEditName.value = true;
};
const timeToMinutes=(time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
}



watch([startAt, endAt], () => {
    console.log("время изменилось");
    localTask.value = { ...task.value };
});
watch([switchControl],async (v) => {
    if(!v) return;
    if(!calendars.value.length) await getCalendars();
});
watch([duration],(v) => console.log('duration',v));
watch([calendarId],(v) => console.log('calendarId',v));


</script>

<style scoped lang="sass">
.menu

    &__header
        text-align: center


    .footer
        border-top: 1px solid #eee
        padding: 1rem
        margin-top: 1rem

        & > *
            font-size: 13px
            color: #999

            & > *
                font-weight: 800
</style>
