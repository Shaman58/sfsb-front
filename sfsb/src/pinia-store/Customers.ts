import api from "@/api/instance";
import { defineStore } from "pinia";
import { useToast } from "vue-toast-notification";
import ERROR_MESSAGE from "./ErrorMessages";

const toast = useToast();

export default defineStore("customer", {
    state: (): { customers: Customer[] } => ({ customers: [] as Customer[] }),
    actions: {
        async fetchCustomers(){
            try {
                const { data } = await api.get<Customer[]>(`/customer`);
                this.customers = data;
            } catch (error) {
                toast.error(ERROR_MESSAGE.customers.fetch);
            }
        },
        async saveCustomer(customer: Customer) {
            try {
                const url = customer.id
                    ? `/customer/${customer.id}`
                    : "/customer";

                customer.id
                    ? await api.put(url, customer)
                    : await api.post(url, customer);

                this.fetchCustomers()
                toast.info("Данные успешно сохранены");

            } catch (error) {
                toast.error(ERROR_MESSAGE.customers.save + error)
            }
        }
    },
});
