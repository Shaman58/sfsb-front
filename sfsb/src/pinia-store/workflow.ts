import { defineStore } from "pinia";
import { computed, getCurrentInstance, reactive, ref } from "vue";
import { fakeResources } from "@/components/workflow/fakeResources";

export const useWorkflowStore = defineStore("workflow", () => {
    const { proxy } = getCurrentInstance();
    const MIN_TIMELINE_PX = proxy.$MIN_TIMELINE_PX;
    const MIN_TIMELINE = proxy.$MIN_TIMELINE;

    const resources = reactive<Resource[]>(fakeResources);
    const resourceObject = computed(() => {
        return resources.reduce((acc, resource) => {
            acc[resource.id] = resource;
            return acc;
        }, {} as Record<number, Resource>);
    });
    const tasks = computed(() =>
        resources.flatMap((resource) => resource.tasks)
    );
    const currentTaskId = ref<number | undefined>(undefined);
    const offsetCell = ref<number | undefined>();

    const taskWillMoveData = reactive<ExtendedTaskWillMoveData>(
        {} as ExtendedTaskWillMoveData
    );
    const _sourceResourceId = ref<number | undefined>(undefined);
    const _targetResourceId = ref<number | undefined>(undefined);

    const sourceResourceId = computed({
        get: () => _sourceResourceId.value,
        set: (id: number | undefined) => {
            _sourceResourceId.value = id;
            if (id === undefined) {
                activeCells.value = [];
            }
        },
    });
    const targetResourceId = computed({
        get: () => _targetResourceId.value,
        set: (id: number | undefined) => {
            _targetResourceId.value = id;
        },
    });

    //--- signals ---
    const activeCells = ref<
        { cellId: number; resourceId: number; assignedTaskId?: number }[]
    >([]);

    const signals = reactive({
        activeCells,
    });

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

    const createPullCells = (
        startCell: number,
        offset: number,
        totalCells: number
    ): number[] => {
        const res: number[] = [];
        for (
            let i = startCell - offset + 1;
            i < startCell - offset + totalCells + 1;
            i++
        ) {
            res.push(i);
        }
        return res;
    };

    //--- events ---
    const onDragOver = (
        cellId: number,
        resourceId: number,
        assignedTaskId: number
    ) => {
        targetResourceId.value = resourceId;

        if (!currentTaskId.value) return;
        // const { left, right } = getTaskBoundaries(currentTaskId.value);

        const pullCells = createPullCells(
            cellId,
            offsetCell.value || 0,
            findTask.totalCells(currentTaskId.value) || 0
        );
        console.log({ pullCells });
        activeCells.value = pullCells.map((cell) => ({
            cellId: cell,
            resourceId,
            assignedTaskId: undefined,
        }));
    };

    const onDragLeave = (cellId: number, resourceId: number) => {
        const hasSameCell = activeCells.value.find(
            (e) => e.cellId === cellId && e.resourceId === resourceId
        );
        if (hasSameCell) return;
        activeCells.value = activeCells.value.filter(
            (e) => e.cellId !== cellId && e.resourceId !== resourceId
        );
    };

    const onDrop = () => {
        if (!sourceResourceId.value) return;
        currentTaskId.value && moveTask(currentTaskId.value);
        sourceResourceId.value = undefined;
        activeCells.value = [];
        if (!currentTaskId.value) return;
        console.log(getTaskBoundaries(currentTaskId.value));
        currentTaskId.value = undefined;
    };

    const events = reactive({
        onDragOver,
        onDragLeave,
        onDrop,
    });

    //--- moving ---

    const moveTask = (id: number) => {
        if (!targetResourceId.value || !sourceResourceId.value) return;
        const taskIndex = findTask.index(id);
        const task = findTask.byId(id);
        if (!task) return;
        const targetResourceIndex = findResource.index(targetResourceId.value);
        const sourceResourceIndex = findResource.index(sourceResourceId.value);
        if (
            taskIndex === undefined ||
            targetResourceIndex === undefined ||
            sourceResourceIndex === undefined
        )
            return;

        resources[sourceResourceIndex].tasks = resources[
            sourceResourceIndex
        ].tasks.filter((e) => e.id !== id);
        resources[targetResourceIndex].tasks = [
            ...resources[targetResourceIndex].tasks,
            task,
        ];

        targetResourceId.value = undefined;
        sourceResourceId.value = undefined;
    };

    const expandTaskLeft = (id: number) => {};
    const expandTaskRight = (id: number) => {};
    const shrinkTaskLeft = (id: number) => {};
    const shrinkTaskRight = (id: number) => {};

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
    const findTaskById = (id: number) => {
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

    return {
        resources,
        tasks,
        currentTaskId,
        offsetCell,
        taskWillMoveData,
        find: {
            findResource,
            findTask,
        },
        sourceResourceId,
        targetResourceId,
        move: {
            moveTask,
            expandTaskLeft,
            expandTaskRight,
            shrinkTaskLeft,
            shrinkTaskRight,
        },
        signals,
        events,
    };
});
