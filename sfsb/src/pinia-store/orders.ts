import {defineStore} from "pinia";
import api, {query} from "@/api/instance";
import {useToast} from "vue-toast-notification";
import {Ref, ref} from "vue";
import checkStatus from "@/mixins/CheckStatus";
import {Axios} from "axios";

const toast = useToast();

export const useOrdersStore = defineStore("orders", () => {
    const orders: Ref<Order[]> = ref([]);
    const loading = ref(false);

    const getOrders = async (search?: string) => {
        loading.value = true
        const url = search ? "/order/find" : "/order";
        try {
            const response = await api.get(url, {params: {search}});
            checkStatus(response)
            orders.value = response.data;
        } catch (error) {
            toast.error("Ошибка получения списка заказов " + error);
        } finally {
            loading.value = false
        }
    };

    const saveOrder = async (order: Order): Promise<Order | undefined> => {
        const url = order.id
            ? `/order/${order.id}`
            : '/order'
        const method: keyof Axios = order.id ? 'put' : 'post';
        return await query<Order>(async () => await api[method](url, order))
    }

    const deleteOrder = async (order: Order) => {
        return await query<Order>(async () => await api.delete(`/order/${order.id}`))
    }
    const saveKP = async (orderId: number, companyId: number) => {
        const url = `/doc/kp/remote`;
        return await query(async () => await api.get(url, {params: {orderId, companyId}}))
    }

    const getKP = async (orderId: number, companyId: number) => {
        const url = `/doc/cp`
        return await query(async () => await api.get(url, {params: {orderId, companyId}}), {success: ""})
    }

    const getToolPrint = async (orderId: number, companyId: number) => {
        const url = `doc/tool-order`
        return await query<ToolPrint>(async () => await api.get(url, {params: {orderId, companyId}}), {success: ""})
    }


    return {
        orders,
        loading,
        getOrders,
        saveOrder,
        deleteOrder,
        saveKP,
        getKP,
        getToolPrint
    };


});
