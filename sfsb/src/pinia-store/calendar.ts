import {defineStore} from "pinia";
import {computed, ComputedRef, reactive, ref} from "vue";
import calendarApi from "@/api/calendarApi";
import {useToast} from "vue-toast-notification";

export const useCalendars = defineStore("calendar", () => {
    const calendars = ref<Calendar[]>([])
    const gettingData = ref(false)
    const err = ref<any>()

    const getCalendars = async () => {
        gettingData.value = true;
        try {
            const {data} = await calendarApi.get("/all");
            calendars.value = data;
        } catch (e) {
            err.value = e;
        }
        gettingData.value = false;
    };

    const getCalendarById = async (id: number) => {
        gettingData.value = true;
        try {
            const {data} = await calendarApi.get(`/${id}`);
            return data;
        } catch (e) {
            err.value = e;
        }
        gettingData.value = false;
    }

    return {
        calendars,
        getCalendars,
        getCalendarById
    };
});
