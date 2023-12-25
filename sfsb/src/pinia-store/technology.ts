import { defineStore } from "pinia";
import api from "@/api/instance";
import { useToast } from "vue-toast-notification";
import { Ref, ref } from "vue";
import { useCurrentUserStore } from "./currentUser";

const toast = useToast();

export const useTechnologyStore = defineStore("technology", () => {
    const dialogVisible: Ref<boolean> = ref(false);
    const currentTechnology: Ref<Technology> = ref({} as Technology);

    const getTechnologyById = async (id: string | number) => {
        try {
            const url = `/technology/${id}`;
            const res = await api.get<Technology>(url);
            res.status === 200
                ? (currentTechnology.value = res.data)
                : toast.error(
                      "Ошибка при получении технологии " + res.statusText
                  );
        } catch (error) {
            toast.error("Ошибка при получении технологии " + error);
        }
    };

    const saveTechnology = async (technology: Technology) => {
        try {
            const url = `/technology/${technology.id}`;
            await api.put(url, technology);
            toast.info("Успешно сохранено!", { position: "top-right" });
            await getTechnologyById(technology.id);
        } catch (error) {
            toast.error("Ошибка при сохранении данных " + error);
        }
    };

    const setTechnologyDialogVisible = (visible: boolean) => {
        dialogVisible.value = visible;
    };

    const changeBlocked = async (status: boolean) => {
        const url = status
            ? `/technology/${currentTechnology.value.id}/block`
            : `/technology/${currentTechnology.value.id}/unblock`;
        try {
            const resp = await api.get(url);
            if (resp.status > 400)
                throw new Error("Ошибка при изменении блокировки");
            await getTechnologyById(currentTechnology.value.id);
        } catch (error) {
            toast.error("Ошибка при изменении блокировки " + error);
        }
    };

    const isEqualTechnolgyUserAndCurrentUser = async () => {
        const { user: currentUser } = useCurrentUserStore();
        const user = currentTechnology.value.user;
        return user.id === currentUser?.id;
    };

    return {
        dialogVisible,
        currentTechnology,
        isEqualTechnolgyUserAndCurrentUser,
        getTechnologyById,
        saveTechnology,
        setTechnologyDialogVisible,
        changeBlocked,
    };
});
