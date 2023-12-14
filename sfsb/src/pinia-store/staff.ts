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

    const saveStaff = async (staff: Person) => {
        const fd = new FormData();
        Object.entries(staff).forEach(([key, value]) => {fd.append(key, value)});
        console.log("fd from store", [...fd.entries()]);

        const url = staff.id? `/user/${staff.id}` : "/user";
        const method = staff.id? "put" : "post";

        try {
            const response = await api[method](url, {body:fd});
            if(response.status >= 400) throw new Error("Ошибка при сохранении данных пользователя");
            toast.success("Данные сохранены");
            await getAllStaff()
        } catch (error) {
            toast.error("Ошибка при сохранении данных пользователя "+error);
        }
    }

    return {
        staff,
        getAllStaff,
        saveStaff,
    };
});

