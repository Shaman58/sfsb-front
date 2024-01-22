import {defineStore} from "pinia";
import api, {query} from "@/api/instance";
import {useToast} from "vue-toast-notification";
import {Ref, ref} from "vue";
import {Axios} from "axios";

const toast = useToast();

export const useToolingStore = defineStore("tooling", () => {
    const toolings: Ref<Tool[]> = ref([]);
    const loading: Ref<boolean> = ref(false)

    const fetchToolings = async () => {
        loading.value = true
        toolings.value = await query(async () => await api.get("/tooling"), {success: ""})
        loading.value = false
    };

    const saveToolings = async (tooling: Tool) => {
        const url = tooling.id ? `/tooling/${tooling.id}` : "/tooling";
        const method: keyof Axios = tooling.id ? "put" : "post"
        loading.value = true
        await query<Tool>(async () => await api[method](url, tooling))
        await fetchToolings()
        loading.value = false
    };

    const deleteTooling = async (tooling: Tool) => {
        loading.value = true
        await query(async () => await api.delete(`/tooling/${tooling.id}`))
        loading.value = false
    };

    return {
        toolings,
        loading,
        fetchToolings,
        saveToolings,
        deleteTooling,
    };
});
