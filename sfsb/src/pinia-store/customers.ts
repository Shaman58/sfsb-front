import {defineStore} from "pinia";
import api, {query} from "@/api/instance";
import {useToast} from "vue-toast-notification";
import {Ref, ref} from "vue";
import checkStatus from "@/mixins/CheckStatus";
import {Axios} from "axios";

const toast = useToast();

export const useCustomersStore = defineStore("customers", () => {
    const customers: Ref<Customer[]> = ref([])
    const loading: Ref<boolean> = ref(false)

    const fetchCustomers = async () => {
        loading.value = true;
        customers.value = await query(async () => await api.get("/customer"), {success: ""})
        loading.value = false;
    }

    const saveCustomer = async (customer: Customer) => {
        const url = customer.id
            ? `/customer/${customer.id}`
            : '/customer';
        const method: keyof Axios = customer.id ? 'put' : 'post';
        loading.value = true;
        await query(async () => await api[method](url, customer))
        await fetchCustomers()
        loading.value = false;
    }

    const deleteCustomer = async (customer: Customer) => {
        try {
            loading.value = true;
            const response = await api.delete(`/customer/${customer.id}`);
            checkStatus(response)
            customers.value = customers.value.filter(c => c.id !== customer.id)
            toast.info("Успешно удален!", {position: "top-right"});

        } catch (error) {
            toast.error("Ошибка в удалении данных клиентов " + error)
        } finally {
            loading.value = false;
        }
    }
    return {
        customers,
        loading,
        fetchCustomers,
        saveCustomer,
        deleteCustomer
    }
});
