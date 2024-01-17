import {defineStore} from "pinia";
import api, {query} from "@/api/instance";
import {useToast} from "vue-toast-notification";
import {Ref, ref} from "vue";
import {Axios} from "axios";

const toast = useToast();

export const useSpecialStore = defineStore("specials", () => {
    const specials: Ref<Tool[]> = ref([]);
    const loading: Ref<boolean> = ref(false)

    const fetchSpecials = async () => {
        loading.value = true
        specials.value = await query(async () => await api.get("/special"))
        loading.value = false
    };

    const saveSpecial = async (special: Tool) => {
        const url = special.id ? `/special/${special.id}` : "/special";
        const method: keyof Axios = special.id ? "put" : "post"
        loading.value = true
        await query<Tool>(async () => await api[method](url, special))
        await fetchSpecials()
        loading.value = false
    };

    const deleteSpecial = async (special: Tool) => {
        loading.value = true
        await query(async () => await api.delete(`/special/${special.id}`))
        loading.value = false
    };

    return {
        specials,
        loading,
        fetchSpecials,
        saveSpecial,
        deleteSpecial,
    };
});
