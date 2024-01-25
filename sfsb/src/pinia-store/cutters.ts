import {defineStore} from "pinia";
import api, {query} from "@/api/instance";
import {useToast} from "vue-toast-notification";
import {Ref, ref} from "vue";
import {Axios} from "axios";

const toast = useToast();

export const useCuttersStore = defineStore("cutters", () => {
    const cutters: Ref<Tool[]> = ref([]);
    const loading: Ref<boolean> = ref(false)

    const fetchCutters = async () => {
        loading.value = true
        cutters.value = await query(async () => await api.get("/cutter"), {success: ""}) || []
        loading.value = false
    };

    const saveCutter = async (cutter: Tool) => {
        const url = cutter.id ? `/cutter/${cutter.id}` : "/cutter";
        const method: keyof Axios = cutter.id ? "put" : "post"
        loading.value = true
        await query<Tool>(async () => await api[method](url, cutter))
        await fetchCutters()
        loading.value = false
    };

    const deleteCutter = async (cutter: Tool) => {
        loading.value = true
        await query(async () => await api.delete(`/cutter/${cutter.id}`))
        loading.value = false
    };

    return {
        cutters,
        loading,
        fetchCutters,
        saveCutter,
        deleteCutter,
    };
});
