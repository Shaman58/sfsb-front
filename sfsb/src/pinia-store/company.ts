import { defineStore } from "pinia";
import api from "@/api/instance";
import { useToast } from "vue-toast-notification";
import { Ref, ref } from "vue";

const toast = useToast();

export const useCompanyStore = defineStore("company", () => {
    const company: Ref<Company> = ref({} as Company);

    const fetchCompanyData = async () => {
        try {
            const response = await api.get("/company");
            if (response.status >= 400) throw new Error(response.statusText);
            company.value = response.data;
        } catch (error) {
            toast.error("Ошибка получения данных компании " + error);
        }
    };

    const saveCompany = async (data: Company) => {
        try {
            const response = await api.put("/company", data);
            if (response.status >= 400) throw new Error(response.statusText);
            company.value = data;
            toast.info("Успешно сохранено!", { position: "top-right" });
        } catch (error) {
            toast.error("Ошибка передачи данных компании " + error);
        }
    };

    return {
        company,
        fetchCompanyData,
        saveCompany,
    };
});
