import api from "@/api/instance";
import {defineStore} from "pinia";
import { useToast } from "vue-toast-notification";
import ERRORS from "./ErrorMessages"

const toast = useToast();

export default defineStore("company", {
    state: (): {company:Company} => ({company:{} as Company}),
    actions: {
        async fetchCompanyData(){
            try {
                const {data} = await api.get("/company")
                this.company = data
            } catch (error) {
                toast.error(ERRORS.company.fetch)
            }
        },
        async saveCompany(company: Company){
            try {
                const data: Company = await (await api.put("/company", company)).data
                this.company = data
                toast.info("Успешно сохранено!");
            } catch (error) {
                toast.error(ERRORS.company.save + error)
            }
        }
    },
});
