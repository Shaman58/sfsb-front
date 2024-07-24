import { defineStore } from "pinia";
import api, { query } from "@/api/instance";
import { useToast } from "vue-toast-notification";
import { computed, Ref, ref } from "vue";
import checkStatus from "@/mixins/CheckStatus";
import { Axios } from "axios";

const toast = useToast();

export const useOrdersStore = defineStore("orders", () => {
    const ordersByPortions = ref<Order[][]>([[]]);
    const orders: Ref<Order[]> = computed(() => ordersByPortions.value.flat());
    const loading = ref(false);
    const limit = 20;
    const currentOffset = ref(0);
    let previousDownloadLength = ref(0);
    let completePortion = computed(() => previousDownloadLength.value >= limit);

    const next = async (search?: string) => {
        completePortion.value && (currentOffset.value += 1);
        loading.value = true;
        const url = search ? "/order/find" : "/order";
        try {
            const response = await api.get(url, {
                params: {
                    search,
                    offset: currentOffset.value,
                    limit,
                },
            });
            checkStatus(response);

            if (
                response.data.length !== previousDownloadLength.value ||
                response.data.length >= limit
            ) {
                ordersByPortions.value[currentOffset.value] = response.data;
            }

            previousDownloadLength.value = response.data.length;
        } catch (error) {
            toast.error("Ошибка получения списка заказов " + error);
        } finally {
            loading.value = false;
        }
    };

    const clearCurrentOffset = () => {
        currentOffset.value = 0;
    };

    const getOrders = async (search?: string) => {
        loading.value = true;
        const url = search ? "/order/find" : "/order";
        try {
            const response = await api.get(url, { params: { search, limit } });
            checkStatus(response);
            ordersByPortions.value[0] = response.data;
            previousDownloadLength.value = orders.value.length;
        } catch (error) {
            toast.error("Ошибка получения списка заказов " + error);
        } finally {
            loading.value = false;
        }
    };

    const getOrderById = async (id: number) => {
        loading.value = true;
        const url = `/order/${id}`;
        try {
            const response = await api.get(url);
            checkStatus(response);
            return response.data;
        } catch (error) {
            toast.error("Ошибка получения заказа id=" + id);
        } finally {
            loading.value = false;
        }
    };

    const saveOrder = async (order: Order): Promise<Order | undefined> => {
        const url = order.id ? `/order/${order.id}` : "/order";
        const method: keyof Axios = order.id ? "put" : "post";
        const res = await query<Order>(
            async () => await api[method](url, order)
        );
        console.log({ res });
        return res;
    };

    const deleteOrder = async (id: number) => {
        loading.value = true;
        try {
            await query<Order>(async () => await api.delete(`/order/${id}`));

            for (let i = 0; i < ordersByPortions.value.length; i++) {
                const index = ordersByPortions.value[i].findIndex(
                    (e) => e.id === id
                );
                index !== -1 && ordersByPortions.value[i].splice(index, 1);
            }
        } catch (error) {
            toast.error("Ошибка удаления заказа " + error);
        } finally {
            loading.value = false;
        }
    };

    const saveKP = async (orderId: number, companyId: number) => {
        const url = `/doc/kp/remote`;
        return await query(
            async () => await api.get(url, { params: { orderId, companyId } })
        );
    };

    const getKP = async (orderId: number, companyId: number) => {
        const url = `/doc/cp`;
        return await query(
            async () => await api.get(url, { params: { orderId, companyId } }),
            { success: "" }
        );
    };

    const getToolPrint = async (orderId: number, companyId: number) => {
        const url = `doc/tool-order`;
        return await query<ToolPrint>(
            async () => await api.get(url, { params: { orderId, companyId } }),
            { success: "" }
        );
    };

    return {
        orders,
        loading,
        next,
        clearCurrentOffset,
        getOrders,
        getOrderById,
        saveOrder,
        deleteOrder,
        saveKP,
        getKP,
        getToolPrint,
    };
});
