import { defineStore } from "pinia";
import api from "@/api/instance";
import { useToast } from "vue-toast-notification";
import { Ref, ref } from "vue";
import checkStatus from "@/mixins/CheckStatus";

const toast = useToast();

export const useOrdersStore = defineStore("orders", () => {
    const orders: Ref<Order[]> = ref([]);

    const getOrders = async (search?: string) => {
        const url = search ? "/order/find" : "/order";
        try {
            const response = await api.get(url, { params: { search } });
            checkStatus(response)
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
