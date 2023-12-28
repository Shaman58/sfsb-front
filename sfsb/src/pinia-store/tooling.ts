import { defineStore } from "pinia";
import api from "@/api/instance";
import { useToast } from "vue-toast-notification";
import { Ref, ref } from "vue";

const toast = useToast();

export const useToolingStore = defineStore("tooling", () => {
    const toolings: Ref<Tool[]> = ref([]);

    const fecthToolings = async () => {
        try {
            const response = await api.get("/tooling");
            if (response.status >= 400) throw new Error(response.statusText);
            toolings.value = response.data;
        } catch (error) {
            toast.error("Ошибка в получениее данных приспособлений " + error);
        }
    };

    const saveToolings = async (tool: Tool) => {
        try {
        } catch (error) {}
    };

    return {
        toolings,
        fecthToolings,
    };
});
