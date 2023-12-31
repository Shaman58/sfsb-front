import { defineStore } from "pinia";
import api from "@/api/instance";
import { useToast } from "vue-toast-notification";
import { Ref, ref } from "vue";
import checkStatus from "@/mixins/CheckStatus";

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
                {...staff, picture:""},
                { headers: { "Content-Type": "application/json" } }
            );
            checkStatus(response)
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
            checkStatus(response)
            toast.success("Данные сохранены");
            await getAllStaff();
        } catch (error) {
            toast.error("Ошибка при сохранении аватара пользователя " + error);
        }
    };

    const deleteStaff = async (staff: Person) => {
        try {
            const response = await api.delete(`/user/${staff.id}`);
            checkStatus(response)
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
