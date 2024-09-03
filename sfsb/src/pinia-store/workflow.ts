import { defineStore } from "pinia";
import { computed, reactive } from "vue";
import workflowApi from "@/api/workflowApi";

export const useWorkflow = defineStore("workflow", () => {
    const resources = reactive<Resource[]>([]);
    const getResources = async () => {
        const { data } = await workflowApi.get("/all");
        data.forEach(
            (resource: Resource, index: number) => (resources[index] = resource)
        );
    };

    const getAllTasks = computed((): Task[] => {
        if (resources.length === 0) return [];
        return resources.flatMap((resource) => resource.tasks);
    });

    const calculateDaysDifference = (date1: string, date2: string): number => {
        const time1 = new Date(date1).getTime();
        const time2 = new Date(date2).getTime();

        // Разница во времени в миллисекундах
        const timeDifference = Math.abs(time2 - time1);

        // Преобразуем миллисекунды в дни
        const daysDifference = Math.ceil(
            timeDifference / (1000 * 60 * 60 * 24)
        );

        return daysDifference;
    };

    return {
        resources,
        getAllTasks,
        getResources,
    };
});
