import { defineStore } from "pinia";
import api from "@/api/instance";
import { useToast } from "vue-toast-notification";
import { Ref, ref } from "vue";

const toast = useToast();

export const useOrdersStore = defineStore("orders", () => {
    const orders: Ref<Order[]> = ref([]);

    const getOrders = async () => {
        try {
            const response = await api.get("/order");
            if (response.status > 400) throw new Error(response.statusText);
            orders.value = response.data;
        } catch (error) {
            toast.error("Ошибка получения списка заказов " + error);
        }
    };

    return {
        orders,
        getOrders,
    };
});
