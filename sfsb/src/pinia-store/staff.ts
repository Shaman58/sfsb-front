import { defineStore } from "pinia";
import api from "@/api/instance";
import { useToast } from "vue-toast-notification";
import { Ref, ref } from "vue";

const toast = useToast();

export const useStaffStore = defineStore("staff", () => {
    const staff: Ref<Person[]> = ref([] as Person[]);

    const getAllStaff = async () => {
        try {
            const response = await api.get("/user");
            staff.value = response.data;
        } catch (error) {
            toast.error("Ошибка при загрузке данных пользователей " + error);
        }
    };

    const saveStaff = async (staff: Person) => {

        const url = staff.id ? `/user/${staff.id}` : "/user";
        const method = staff.id ? "put" : "post";

        try {
            const response = await api[method](
                url,
                staff,
                { headers: { "Content-Type": "application/json" } }
            );
            if (response.status >= 400)
                throw new Error("Ошибка при сохранении данных пользователя");
            toast.success("Данные сохранены");
            await getAllStaff();
            return true
        } catch (error) {
            toast.error("Ошибка при сохранении данных пользователя " + error);
        }
    };

    const saveAvatar = async (id: string, avatar: FormData) => {
        try {
            const response = await api.put(
                `/user/file/${id}`,
                avatar,
                { headers: { "Content-Type": "multipart/form-data" } }
            );
            if (response.status >= 400)
                throw new Error(response.statusText);
            toast.success("Данные сохранены");
            await getAllStaff();
        } catch (error) {
            toast.error("Ошибка при сохранении аватара пользователя " + error);
        }
    };

    const deleteStaff = async (staff: Person) => {
        try {
            const response = await api.delete(`/user/${staff.id}`);
            if (response.status >= 400)
                throw new Error("Ошибка при сохранении данных пользователя");
            toast.success("Данные удалены");
            await getAllStaff();
        } catch (error) {
            toast.error("Ошибка при удалении данных пользователя " + error);
        }
    };

    return {
        staff,
        getAllStaff,
        saveStaff,
        deleteStaff,
        saveAvatar
    };
});
