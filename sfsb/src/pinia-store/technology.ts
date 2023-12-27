import { defineStore } from "pinia";
import api from "@/api/instance";
import { useToast } from "vue-toast-notification";
import { Ref, ref } from "vue";
import { useCurrentUserStore } from "./currentUser";

const toast = useToast();

export const useTechnologyStore = defineStore("technology", () => {
    const dialogVisible: Ref<boolean> = ref(false);
    const currentItem: Ref<Item> = ref({} as Item);
    const isBlockedByCurrentUser: Ref<boolean> = ref(false);

    const getTechnologyById = async (id: string | number) => {
        try {
            const url = `/item/${id}`;
            const res = await api.get<Item>(url);
            res.status === 200
                ? ((currentItem.value = res.data),
                  (isBlockedByCurrentUser.value =
                      compareBlockedAndCurrentUser()))
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

    const setCurrentItem = (item: Item) => {
        currentItem.value = item;
        setTechnologyDialogVisible(true);
        isBlockedByCurrentUser.value = compareBlockedAndCurrentUser();
    };
    const setTechnologyDialogVisible = (visible: boolean) => {
        dialogVisible.value = visible;
    };

    const changeBlocked = async (status: boolean) => {
        const url = status
            ? `/technology/${currentItem.value.technology.id}/block`
            : `/technology/${currentItem.value.technology.id}/unblock`;
        try {
            const resp = await api.get(url);
            if (resp.status > 400)
                throw new Error("Ошибка при изменении блокировки");
            await getTechnologyById(currentItem.value.id);
            isBlockedByCurrentUser.value = compareBlockedAndCurrentUser();
        } catch (error) {
            toast.error("Ошибка при изменении блокировки " + error);
        }
    };

    const compareBlockedAndCurrentUser = () => {
        const { user: currentUser } = useCurrentUserStore();
        const blocked = currentItem.value.technology.blocked;
        return blocked === currentUser?.id;
    };

    return {
        dialogVisible,
        currentItem,
        isBlockedByCurrentUser,
        getTechnologyById,
        setCurrentItem,
        saveTechnology,
        setTechnologyDialogVisible,
        changeBlocked,
    };
});
