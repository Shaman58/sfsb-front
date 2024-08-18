import { defineStore } from "pinia";
import { getCurrentInstance, reactive } from "vue";
import { fakeResources } from "@/components/workflow/fakeResources";

export const useWorkflowStore = defineStore("workflow", () => {
    const { proxy } = getCurrentInstance();
    const MIN_TIMELINE_PX = proxy.$MIN_TIMELINE_PX;
    const MIN_TIMELINE = proxy.$MIN_TIMELINE;

    const resources = reactive<Resource[]>(fakeResources);

    //--- helpers ---
    const getCellByTime = (time: string, resource: Resource) => {
        const { startAt: startResource } = resource;
        return Math.floor(
            (new Date(time).getTime() - new Date(startResource).getTime()) /
                MIN_TIMELINE
        );
    };
    const getTimeByIndex = (index: number, resource: Resource) => {
        const { startAt: startResource } = resource;
        return {
            start: new Date(
                new Date(startResource).getTime() + index * MIN_TIMELINE
            ).toISOString(),
            end: new Date(
                new Date(startResource).getTime() + (index + 1) * MIN_TIMELINE
            ).toISOString(),
        };
    };
    const getTaskBoundaries = (
        taskId: number
    ): { left?: number; right?: number } => {
        const task = findTask.byId(taskId);
        const resource = findResource.byTaskId(taskId);
        if (!task || !resource) return { left: undefined, right: undefined };
        const { startAt, endAt } = task;
        return {
            left: getCellByTime(startAt, resource),
            right: getCellByTime(endAt, resource) - 1,
        };
    };

    //--- find ---

    const findResource = {
        byId: (id: number): Resource | undefined => {
            return resources.find((resource) => resource.id === id);
        },
        byTaskId: (id: number) => {
            const resource = resources.find((resource) =>
                resource.tasks.find((task: Task) => task.id === id)
            );
            if (!resource) return;
            return resource;
        },
        index: (id: number): number | undefined => {
            return resources.findIndex((resource) => resource.id === id);
        },
    };
    const findTaskById = (id: number): Task | undefined => {
        const resource = findResource.byTaskId(id);
        if (!resource) return;
        const task = resource?.tasks.find((task: Task) => task.id === id);
        if (!task) return;
        return task;
    };
    const findTask = {
        byId: findTaskById,
        index: (id: number): number | undefined => {
            const resource = findResource.byTaskId(id);
            if (!resource) return;
            return resource.tasks.findIndex((task) => task.id === id);
        },
        totalCells: (id: number): number | undefined => {
            const task = findTaskById(id);
            if (!task) return;
            const { startAt, endAt } = task;
            return Math.floor(
                (new Date(endAt).getTime() - new Date(startAt).getTime()) /
                    MIN_TIMELINE
            );
        },
    };

    //--- changing task ---
    const changeTask = {
        startAt: (id: number, time: string) => {
            const task = findTaskById(id);
            if (!task) return;
            task.startAt = time;
        },
        endAt: (id: number, time: string) => {
            const task = findTaskById(id);
            if (!task) return;
            task.endAt = time;
        },
        addTask: (resourceId: number, task: Task) => {
            const resource = findResource.byId(resourceId);
            if (!resource) return;
            resource.tasks.push(task);
        },
        removeTask: (id: number): Task | undefined => {
            const resource = findResource.byTaskId(id);
            if (!resource) return;
            const index = findTask.index(id);
            if (index === undefined) return;
            return resource.tasks.splice(index, 1)[0];
        },
    };

    return {
        resources,
        find: {
            findResource,
            findTask,
        },
        changeTask,
    };
});
