import {defineStore} from "pinia";
import api from "@/api/instance";
import {useToast} from "vue-toast-notification";
import {ref} from "vue";

const toast = useToast();

export const useItemStore = defineStore("items", () => {
    const items = ref<Item[]>([] as Item[]);
    const item = ref<Item>({} as Item);
    const loading = ref(false)

    const fetchItems = async () => {
        loading.value=true
        try {
            const response = await api.get("/item");
            items.value = response.data;
        } catch (error) {
            toast.error("Ошибка при получении позиций заказа " + error);
        } finally {
            loading.value = false
        }
    };

    const fetchItem = async (id: number) => {
        loading.value = true
        try {
            const response = await api.get(`/item/${id}`);
            item.value = response.data;
        } catch (error) {
            toast.error(`Ошибка при загрузке позиции заказа №${id} ` + error);
        } finally {
            loading.value = false
        }
    };

    const calculateItem = async (id: number) => {
        loading.value = true
        try {
            const response = await api.get("/doc/calculate", {
                params: {itemId: id},
            });
            if (response.status === 200)
                return toast.info("Успешно расчитано!");
            throw Error(response.statusText);
        } catch (error) {
            toast.error(`Ошибка при расчете позиции заказа ` + error);
        } finally {
            loading.value = false
        }
    };

    return {
        items,
        item,
        loading,
        fetchItems,
        fetchItem,
        calculateItem,
    };
});
