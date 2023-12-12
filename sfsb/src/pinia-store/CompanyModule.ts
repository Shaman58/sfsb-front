import api from "@/api/instance";
import {defineStore} from "pinia";
import { useToast } from "vue-toast-notification";

const toast = useToast();

export default defineStore("company", {
    state: () => ({ company: {} }),
    actions: {
        async fetchCompanyData(){
            try {
                const {data} = await api.get("/company")
                this.company = data
            } catch (error) {
                toast.error("Ошибка запроса данных компании")
            }
        },
        async saveCompany(company: Company){
            try {
                const {data} = await api.put("/company", company)
                this.company = data
                toast.info("Успешно сохранено!");
            } catch (error) {
                toast.error("Ошибка сохранения данных компании: "+error)
            }
        }
    },
});
