import { defineStore } from "pinia";
import api from "@/api/instance";
import { useToast } from "vue-toast-notification";
import { Ref, ref } from "vue";

const toast = useToast();

export const useItemStore = defineStore("items", () => {
    const items: Ref<Item[]> = ref([] as Item[]);
    const item: Ref<Item> = ref({} as Item);

    const fetchItems = async () => {
        try {
            const response = await api.get("/item");
            items.value = response.data;
        } catch (error) {
            toast.error("Ошибка при получении позиций заказа " + error);
        }
    };

    const fetchItem = async (id: number) => {
        try {
            const response = await api.get(`/item/${id}`);
            item.value = response.data;
        } catch (error) {
            toast.error(`Ошибка при загрузке позиции заказа №${id} ` + error);
        }
    };

    const calculateItem = async (id: number) => {
        try {
            const response = await api.get("/doc/calculate", {
                params: { itemId: id },
            });
            if (response.status === 200)
                return toast.info("Успешно расчитано!");
            throw Error(response.statusText);
        } catch (error) {
            toast.error(`Ошибка при расчете позиции заказа ` + error);
        }
    };

    return {
        items,
        item,
        fetchItems,
        fetchItem,
        calculateItem,
    };
});
