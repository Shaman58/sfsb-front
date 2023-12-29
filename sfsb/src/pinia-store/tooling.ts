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
            toast.error("Ошибка в получениее данных оснастки " + error);
        }
    };

    const saveToolings = async (tooling: Tool) => {
        try {
            const url = tooling.id ? `/tooling/${tooling.id}` : "/tooling";

            const response = await (tooling.id
                ? api.put(url, tooling)
                : api.post(url, tooling));
            if (response.status >= 400) throw new Error(response.statusText);

            const index = toolings.value.findIndex((e) => e.id === tooling.id);
            if (index !== -1) {
                toolings.value.splice(index, 1, tooling);
            } else {
                toolings.value.push(tooling);
            }

            toast.info("Успешно сохранено!", { position: "top-right" });
        } catch (error) {
            toast.error("Оснастка не создана " + error);
        }
    };

    const deleteTooling = async (tooling: Tool) => {
        try {
            const response = await api.delete(`/tooling/${tooling.id}`);
            if (response.status >= 400) throw new Error(response.statusText);
            toolings.value = toolings.value.filter((e) => e.id !== tooling.id);
            toast.info("Успешно удален!", { position: "top-right" });
        } catch (error) {
            toast.error("Ошибка при удалении оснастки " + error);
        }
    };

    return {
        toolings,
        fecthToolings,
        saveToolings,
        deleteTooling,
    };
});
