import {defineStore} from "pinia";
import api from "@/api/instance";
import {useToast} from "vue-toast-notification";
import {Ref, ref} from "vue";
import {AxiosResponse} from "axios";

const toast = useToast();

export const useCustomersStore = defineStore("customers", () => {
    const customers: Ref<Customer[]> = ref([])

    const checkStatus = (response: AxiosResponse<any, any>) =>{
        if(response.status >= 400) throw Error(response.data ? response.data.info : response.statusText)
    }
    const fetchCustomers = async()=>{
        try {
            const response = await api.get("/customer")
            checkStatus(response)
            customers.value = response.data
        } catch (error) {
            toast.error("Ошибка в получении данных клиентов " + error)
        }
    }

    const saveCustomer = async(customer: Customer)=>{
        try {
            const url = customer.id
                ? `/customer/${customer.id}`
                : '/customer';

            const response = customer.id
                ? await api.put(url, customer)
                : await api.post(url, customer);
            checkStatus(response)
            const index = customers.value.findIndex((c: Customer) => c.id === customer.id);
            if (index !== -1) {
                customers.value.splice(index, 1, customer);
            } else {
                customers.value.push(customer);
            }
            toast.info("Успешно сохранено!", {position: "top-right"});
        } catch (error) {
            toast.error("Ошибка в сохранении данных клиентов " + error)
        }
    }

    const deleteCustomer  = async(customer: Customer) =>{
        try {
            const response = await api.delete(`/customer/${customer.id}`);
            checkStatus(response)
            customers.value = customers.value.filter(c => c.id !== customer.id)
            toast.info("Успешно удален!", {position: "top-right"});

        } catch (error) {
            toast.error("Ошибка в удалении данных клиентов " + error)
        }
    }
    return {
        customers,
        fetchCustomers,
        saveCustomer,
        deleteCustomer
    }
});
