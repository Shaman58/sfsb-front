import {defineStore} from "pinia";
import api from "@/api/instance";
import { useToast } from "vue-toast-notification";
import { Ref, ref } from "vue";

const toast = useToast();

export const useStaffStore = defineStore("staff", ()=>{
    const staff: Ref<Person[]> = ref([] as Person[])

    const getAllStaff = async () => {
        try {
            const response = await api.get("/user");
            staff.value = response.data;
        } catch (error) {
            toast.error("Ошибка при загрузке данных пользователей "+error);
        }
    }

    return {
        staff,
        getAllStaff
    }
});

