import { defineStore } from "pinia";
import { getCurrentInstance, reactive } from "vue";
import { fakeResources } from "@/components/workflow/fakeResources";

export const useWorkflowStore = defineStore("workflow", () => {
    const { proxy } = getCurrentInstance();
    const MIN_TIMELINE_PX = proxy.$MIN_TIMELINE_PX;
    const MIN_TIMELINE = proxy.$MIN_TIMELINE;

    const resources = reactive<Resource[]>(fakeResources);
    const taskWillMoveData = reactive<ExtendedTaskWillMoveData>(
        {} as ExtendedTaskWillMoveData
    );

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

    const getTimeByCellId = (id: number, resource: Resource) => {
        const resourceStartAt = resource.startAt;
        return {
            startAt: new Date(
                new Date(resourceStartAt).getTime() +
                    new Date(id * MIN_TIMELINE).getTime()
            ).toISOString(),
            endAt: new Date(
                new Date(resourceStartAt).getTime() +
                    new Date((id + 1) * MIN_TIMELINE).getTime()
            ).toISOString(),
        };
    };

    const replaceTask = (
        taskId: number,
        targetResourceId: number,
        newTaskStartAt?: string,
        newTaskEndAt?: string
    ) => {
        const task: Task | undefined = findTaskById(taskId);
        if (!task) return;
        const sourceResource: Resource | undefined =
            findResource.byTaskId(taskId);
        const targetResource: Resource | undefined =
            findResource.byId(targetResourceId);

        //проверить нг пересечение целевого ресурса и исходного
        const taskStartAt = newTaskStartAt
            ? new Date(newTaskStartAt).getTime()
            : new Date(task?.startAt).getTime();
        const taskEndAt = newTaskEndAt
            ? new Date(newTaskEndAt).getTime()
            : new Date(task?.endAt).getTime();

        const correct =
            targetResource &&
            targetResource.tasks.every((e) => {
                const targetStartAt = new Date(e.startAt).getTime();
                const targetEndAt = new Date(e.endAt).getTime();

                // const include =
                //     taskStartAt >= targetStartAt && taskEndAt <= targetEndAt;
                // const taskOffsetLeft =
                //     taskStartAt < targetStartAt && taskEndAt >= targetStartAt;
                // const taskOffsetRight =
                //     taskStartAt < +taskEndAt && taskEndAt > targetEndAt;
                // const exclude = taskStartAt <= targetStartAt && taskEndAt >= targetEndAt;

                // return !include || !taskOffsetLeft || !taskOffsetRight || !exclude;

                const atLeft =
                    taskStartAt < targetStartAt && taskEndAt < targetStartAt;
                const atRight =
                    taskStartAt > targetEndAt && taskEndAt > targetEndAt;

                return atLeft || atRight;
            });
        if (!correct) return;

        targetResource &&
            task &&
            (targetResource.tasks = [...targetResource.tasks, task]);
        sourceResource &&
            (sourceResource.tasks = [
                ...sourceResource?.tasks.filter((e) => e.id !== taskId),
            ]);

        newTaskStartAt && (task.startAt = newTaskStartAt);
        newTaskEndAt && (task.endAt = newTaskEndAt);
    };

    const moveTask = (cellId: number) => {
        console.log("pre resources", resources);
        const { taskId, totalCell, cell, targetResourceId, resourceId } =
            taskWillMoveData;

        if (!taskId || !resourceId || !totalCell || !cell) return; //TODO: возможно exception или сообщение
        let targetResource =
            targetResourceId && findResource.byId(targetResourceId);
        const sourceResource = findResource.byId(resourceId);
        if (!sourceResource) return;
        if (!targetResource) targetResource = sourceResource;
        if (!targetResource) return;

        const foundTask = findTask.byId(taskId);
        if (!foundTask) return;

        const task: Task = { ...foundTask };

        //вычисляем новые координаты таски
        const startCellId = cellId + 1 - cell;
        const endCellId = startCellId + totalCell - 1;

        const startTime = getTimeByCellId(startCellId, targetResource).startAt;
        const endTime = getTimeByCellId(endCellId, targetResource).endAt;

        if (!("id" in targetResource)) return;
        const foundResourceId = resources.findIndex(
            (r) => r.id === (targetResource as Resource).id
        );

        const foundTaskIndex = resources[foundResourceId].tasks.findIndex(
            (t) => t.id === taskId
        );

        //устанвливаем новые начало и конец таски
        task.startAt = startTime;
        task.endAt = endTime;

        //перемещаем таску на другой ресурс если требуется
        if (!!targetResourceId && targetResourceId !== resourceId) {
            if (!targetResource || !task) return;
            targetResource.tasks = [...targetResource.tasks, task]; //добавляем таску на новый ресурс

            const sourceResource = resources.find((r) => r.id === resourceId);
            if (!sourceResource) return;
            const taskIndex = sourceResource.tasks.findIndex(
                (t) => t.id === task.id
            );
            taskIndex !== -1 && sourceResource.tasks.splice(taskIndex, 1); //удаляем таску из ресурса
            return;
        }
        targetResource &&
            (targetResource.tasks[foundTaskIndex].startAt = task.startAt);
        targetResource &&
            (targetResource.tasks[foundTaskIndex].endAt = task.endAt); //устанавливаем новые начало и конец таски
    };

    const onMoveEdgeOfTask = (
        taskId: number,
        edge: "left" | "right",
        direction: "left" | "right"
    ) => {
        const task = findTask.byId(taskId);
        if (!task) return;
        const property = edge === "left" ? "startAt" : "endAt";
        const sign = direction === "left" ? -1 : 1;

        task[property] = new Date(
            new Date(task[property]).getTime() + sign * MIN_TIMELINE
        ).toISOString();

        const resource = findResource.byTaskId(taskId);
        if (!resource) return;
        const resourceIndex = findResource.index(resource.id);
        const taskIndex = findTask.index(taskId);
        if (!!resourceIndex || !taskIndex) return;

        resources[resourceIndex || 0].tasks[taskIndex] = task;
    };
    return {
        resources,
        taskWillMoveData,
        find: {
            findResource,
            findTask,
        },
        changeTask,
        moveTask,
        onMoveEdgeOfTask,
        replaceTask,
    };
});
