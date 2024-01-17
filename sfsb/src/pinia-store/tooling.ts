import {defineStore} from "pinia";
import api, {query} from "@/api/instance";
import {useToast} from "vue-toast-notification";
import {Ref, ref} from "vue";
import {Axios} from "axios";

const toast = useToast();

export const useToolingStore = defineStore("tooling", () => {
    const toolings: Ref<Tool[]> = ref([]);

    const fecthToolings = async () => {
        // try {
        //     const response = await api.get("/tooling");
        //     checkStatus(response)
        //     toolings.value = response.data;
        // } catch (error) {
        //     toast.error("Ошибка в получениее данных оснастки " + error);
        // }
        toolings.value = await query(async () => await api.get("/tooling"))
    };

    const saveToolings = async (tooling: Tool) => {
        // try {
        //     const url = tooling.id ? `/tooling/${tooling.id}` : "/tooling";
        //
        //     const response = await api.get(tooling.id
        //         ? api.put(url, tooling)
        //         : api.post(url, tooling));
        //     checkStatus(response)
        //     const index = toolings.value.findIndex((e) => e.id === tooling.id);
        //     if (index !== -1) {
        //         toolings.value.splice(index, 1, tooling);
        //     } else {
        //         toolings.value.push(tooling);
        //     }
        //
        //     toast.info("Успешно сохранено!", {position: "top-right"});
        // } catch (error) {
        //     toast.error("Оснастка не создана " + error);
        // }
        const url = tooling.id ? `/tooling/${tooling.id}` : "/tooling";
        const method: keyof Axios = tooling.id ? "put" : "post"
        await query<Tool>(async () => await api[method](url, tooling))
    };

    const deleteTooling = async (tooling: Tool) => {
        // try {
        //     const response = await api.delete(`/tooling/${tooling.id}`);
        //     checkStatus(response)
        //     toolings.value = toolings.value.filter((e) => e.id !== tooling.id);
        //     toast.info("Успешно удален!", {position: "top-right"});
        // } catch (error) {
        //     toast.error("Ошибка при удалении оснастки " + error);
        // }
        await query(async () => await api.delete(`/tooling/${tooling.id}`))
    };

    return {
        toolings,
        fecthToolings,
        saveToolings,
        deleteTooling,
    };
});
