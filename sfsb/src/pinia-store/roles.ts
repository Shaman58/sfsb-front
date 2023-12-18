import {defineStore} from "pinia";
import api from "@/api/instance";
import { useToast } from "vue-toast-notification";
import { Ref, ref } from "vue";

const toast = useToast();

export const useRolesStore = defineStore("roles", ()=>{
    const roles: Ref<Roles> = ref([] as Roles)

    const getAllRoles = async () => {
        try {
            const response = await api.get("/role");
            roles.value = response.data;
        } catch (error) {
            toast.error("Ошибка при загрузке данных ролей пользователя "+error);
        }
    }

    return {
        roles,
        getAllRoles,
    };
});

