import { defineStore } from "pinia";
import { computed, ComputedRef, reactive } from "vue";
import workflowApi from "@/api/workflowApi";
import tasksApi from "@/api/tasksApi";
import { useToast } from "vue-toast-notification";

export const useWorkflow = defineStore("workflow", () => {
    const resources = reactive<Resource[]>([]);
    const toast = useToast();

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
        const time1 = new Date(date1);
        time1.setHours(0, 0, 0);
        const time1ms = time1.getTime();
        const time2 = new Date(date2);
        time2.setHours(23, 59, 59);
        const time2ms = time2.getTime();

        // Разница во времени в миллисекундах
        const timeDifference = Math.abs(time2ms - time1ms);

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
        const timeOffset = new Date().getTimezoneOffset() * 60000;
        let day = new Date(
            new Date(
                new Date(getFirstTask.value.startAt).getTime() - timeOffset
            )
                .toISOString()
                .split("T")[0]
        );
        for (let i = 0; i < diff; i++) {
            const inserted = new Date(day);
            res.push(inserted);
            day = new Date(day.setDate(day.getDate() + 1));
        }
        return res;
    });

    const getFirstDayStart = computed(() => getDaysRange.value[0]);

    const toLocaleDate = (value: string | Date) => {
        const offset = new Date().getTimezoneOffset() * 60000;
        const date = new Date(new Date(value).getTime() - offset)
            .toISOString()
            .slice(0, -1);
        return date;
    };

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

    const setTaskParam = (id: number, param: keyof Task, value: any) => {
        const currentResource = getResourceByTaskId(id);
        if (!currentResource)
            return console.error("Resource not found by task id", id);
        const taskIndex = currentResource.tasks.findIndex((e) => e.id === id);
        if (taskIndex === -1) return console.error("Task not found by id", id);
        (currentResource.tasks[taskIndex] as Record<keyof Task, any>)[param] =
            value;
    };

    const reorderTask = async <T extends Task>(
        newTask: T,
        oldTask: T
    ): Promise<void> => {
        try {
            await tasksApi.post(`/replace/${newTask.workflowId}`, newTask);
            relocateTask(newTask.id, newTask.workflowId, newTask);
        } catch (err: any) {
            console.error(err);
            toast.error(err.response.data.message);
        }
    };

    const sendTask = async (
        task: Task | (Task & { offsetX: number; x: number }),
        previousState: Task | undefined
    ): Promise<boolean> => {
        const convertedTask = {
            ...task,
            startAt: toLocaleDate(task.startAt),
            endAt: toLocaleDate(task.endAt),
        };
        try {
            const { data } = await tasksApi.post(
                `/replace/${task.workflowId}`,
                convertedTask
            );
            console.log(data);
            return true;
        } catch (err: any) {
            const resource = getResourceByTaskId(task.id);
            if (!resource) {
                console.error(
                    "сетевая ошибка + не нашел ресурс по переданному task.id = " +
                        task.id,
                    err
                );
                return false;
            }
            const resourceIndex = resources.findIndex(
                (e) => e.id === resource.id
            );
            const taskInStoreIndex = resource.tasks.findIndex(
                (e) => e.id === task.id
            );
            if (taskInStoreIndex === -1) {
                console.error(
                    "сетевая ошибка + не нашел task в ресурсе task.id = " +
                        task.id,
                    err
                );
                return false;
            }
            //возвращаем значкние в store из task.previousState
            if (!previousState) {
                console.error("Не передан previousState");
                return false;
            }
            resources[resourceIndex].tasks[taskInStoreIndex].startAt =
                toLocaleDate(previousState.startAt);
            resources[resourceIndex].tasks[taskInStoreIndex].endAt =
                toLocaleDate(previousState.endAt);
            "message" in err && toast.error(err.response.data.message);
            return false;
        }
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
        setTaskParam,
        sendTask,
        toLocaleDate,
        reorderTask,
    };
});
