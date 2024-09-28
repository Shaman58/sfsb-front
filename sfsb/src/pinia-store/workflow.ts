import { defineStore } from "pinia";
import { computed, ComputedRef, reactive } from "vue";
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

    const getFirstTask: ComputedRef<Task> = computed(
        () =>
            getAllTasks.value.sort(
                (a: Task, b: Task) =>
                    new Date(a.startAt).getTime() -
                    new Date(b.startAt).getTime()
            )[0]
    );

    const getLastTask: ComputedRef<Task> = computed(
        () =>
            getAllTasks.value.sort(
                (a: Task, b: Task) =>
                    new Date(b.endAt).getTime() - new Date(a.endAt).getTime()
            )[0]
    );

    const getTaskById = (id: number): Task | undefined =>
        getAllTasks.value.find((task) => task.id === id);

    const getResourceByTaskId = (id: number): Resource | undefined => {
        return resources.find((resource) =>
            resource.tasks.some((task) => task.id === id)
        );
    };

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

    const getDaysRange: ComputedRef<Date[]> = computed(() => {
        if (!getFirstTask.value || !getLastTask.value) return [];
        const diff = calculateDaysDifference(
            getFirstTask.value.startAt,
            getLastTask.value.endAt
        );

        const res: Date[] = [];
        let day = new Date(
            new Date(getFirstTask.value.startAt).toISOString().split("T")[0]
        );
        for (let i = 0; i < diff; i++) {
            const inserted = new Date(day);
            res.push(inserted);
            day = new Date(day.setDate(day.getDate() + 1));
        }
        return res;
    });

    const getFirstDayStart = computed(() => getDaysRange.value[0]);

    const relocateTask = (
        task: Task | number,
        resourceTo: Resource | number,
        newData?: Partial<Task>
    ): void => {
        const currentTask =
            typeof task === "number"
                ? { ...getTaskById(task), ...newData }
                : { ...task, ...newData };
        let currentResourceFrom: Resource | undefined;
        if (currentTask?.id !== undefined) {
            currentResourceFrom = getResourceByTaskId(currentTask.id);
        }
        const currentResourceTo =
            typeof resourceTo === "number"
                ? resources.find((resource) => resource.id === resourceTo)
                : resourceTo;

        currentTask &&
            currentResourceTo &&
            (currentResourceTo.tasks = [
                ...(currentResourceTo.tasks || []),
                { ...(currentTask as Required<Task>) },
            ]);
        const currentTaskId = currentResourceFrom?.tasks.findIndex(
            (task: Task) => task.id === currentTask?.id
        );

        const currentResourceFromIndex = resources.findIndex(
            (e) => e.id === currentResourceFrom?.id
        );
        currentTask &&
            currentTaskId !== undefined &&
            currentResourceFrom !== undefined &&
            currentResourceFromIndex !== -1 &&
            (resources[currentResourceFromIndex].tasks =
                currentResourceFrom.tasks.filter(
                    (_, i: number) => i !== currentTaskId
                ));
    };

    return {
        resources,
        getAllTasks,
        getFirstTask,
        getLastTask,
        getDaysRange,
        getFirstDayStart,
        getResources,
        getResourceByTaskId,
        relocateTask,
        calculateDaysDifference,
    };
});
