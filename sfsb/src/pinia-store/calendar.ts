import {defineStore} from "pinia";
import {computed, ComputedRef, reactive, ref} from "vue";
import calendarApi from "@/api/calendarApi";
import {useToast} from "vue-toast-notification";
import data from "@/router/data";

export const useCalendars = defineStore("calendar", () => {
    const calendars = ref<Calendar[]>([])
    const gettingData = ref(false)
    const err = ref<any>()

    const getCalendars = async () => {
        gettingData.value = true;
        let resData: Calendar[] = [];
        try {
            const {data} = await calendarApi.get("/all");
            calendars.value = data;
            resData = data;
        } catch (e) {
            err.value = e;
        }
        gettingData.value = false;
        return resData;
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

    const add = async (calendar: Calendar) => {
        gettingData.value = true;
        try {
            await calendarApi.post("/add", calendar);
            await getCalendars();
        } catch (e) {
            err.value = e;
        }
        gettingData.value = false;
    }

    const change = async (calendar: Calendar) => {
        gettingData.value = true;
        try {
            await calendarApi.put("/change", calendar);
            const data=await getCalendars();
            calendars.value = data;
        } catch (e) {
            err.value = e;
        }
        gettingData.value = false;
    }

    return {
        calendars,
        getCalendars,
        getCalendarById,
        add,
        change
    };
});
