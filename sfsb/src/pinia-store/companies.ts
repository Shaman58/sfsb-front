import {defineStore} from "pinia";
import api, {query} from "@/api/instance";
import {useToast} from "vue-toast-notification";
import {Ref, ref} from "vue";

const toast = useToast();

export const useCompaniesStore = defineStore("companies", () => {
    const companies: Ref<Company[]> = ref([] as Company[]);

    const fetchCompaniesData = async () => {
        companies.value = await query(async () => await api.get("/company/manager"), {success: ""})
    };

    const getCompanyById = async (id: number) => {
        try {
            if (!companies.value || !companies.value.length) await fetchCompaniesData()
            return companies.value.find(e => e.id === id);
        } catch (error) {
            toast.error("Ошибка получения данных компании " + error);
        }
    }

    const getShortList = async () => {
        if (!companies.value || !companies.value.length) await fetchCompaniesData()
        return companies.value.map(({id, companyName}) => ({id, companyName}))
    }

    const saveCompany = async (data: Company) => {
        await query(async () => await api.put(`/company/manager/${data.id}`, data))
        await fetchCompaniesData()
    };

    const addCompany = async (data: Company) => {
        await query(async () => await api.post("/company/manager", data))
        await fetchCompaniesData()
    };

    const changeCompanyLogo = async (data: FormData, id: string | number) => {
        const url = `/file/company/${id}`
        await query(async () => await api.post(url, data, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        }))
        await fetchCompaniesData()
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
