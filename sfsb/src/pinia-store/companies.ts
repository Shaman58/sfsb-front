import {defineStore} from "pinia";
import api from "@/api/instance";
import {useToast} from "vue-toast-notification";
import {Ref, ref} from "vue";
import checkStatus from "@/mixins/CheckStatus";
import {AxiosError} from "axios";
import toErrorMessage from "@/mixins/ToErrorMessage";

const toast = useToast();

export const useCompaniesStore = defineStore("companies", () => {
    const companies: Ref<Company[]> = ref([] as Company[]);

    const fetchCompaniesData = async () => {
        try {
            const response = await api.get("/company/manager");
            checkStatus(response)
            companies.value = response.data;
        } catch (error) {
            toast.error("Ошибка получения данных компаний " + error);
        }
    };

    const getCompanyById = async (id: number) => {
        try {
            if (!companies.value || !companies.value.length) await fetchCompaniesData()
            return companies.value.find(e => e.id === id);
        } catch (error) {
            toast.error("Ошибка получения данных компаниb " + error);
        }
    }

    const getShortList = async () => {
        if (!companies.value || !companies.value.length) await fetchCompaniesData()
        return companies.value.map(({id, companyName}) => ({id, companyName}))
    }

    const saveCompany = async (data: Company) => {
        try {
            const response = await api.put(`/company/manager/${data.id}`, data);
            checkStatus(response)
            toast.info("Успешно сохранено!", {position: "top-right"});
        } catch (error) {
            toast.error("Ошибка сохранения данных компании ");
            toErrorMessage(error)
        }
    };


    const addCompany = async (data: Company) => {
        try {
            const response = await api.post("/company/manager", data);
            checkStatus(response)
            toast.info("Успешно сохранено!", {position: "top-right"});
        } catch (error) {
            toast.error("Ошибка сохранения данных компании ");
            toErrorMessage(error)
        }
    };

    const changeCompanyLogo = async (data: FormData, id: string | number) => {
        try {
            const url = `/file/company/${id}`
            const response = await api.post(url, data, {
                headers:{
                    "Content-Type": "multipart/form-data"
                }
            });
            checkStatus(response)
            toast.info("Успешно сохранено!", {position: "top-right"});
            await fetchCompaniesData()
        } catch (error) {
            toast.error("Ошибка сохранения картинки ");
            toErrorMessage(error)
        }
    }

    return {
        companies,
        fetchCompaniesData,
        saveCompany,
        addCompany,
        getCompanyById,
        getShortList,
        changeCompanyLogo
    };
});
