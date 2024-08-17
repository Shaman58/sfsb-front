import { defineStore } from "pinia";
import { computed, reactive, ref } from "vue";
import { fakeResources } from "@/components/workflow/fakeResources";

export const useWorkflowStore = defineStore("workflow", () => {
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
        { cellId: number; resourceId: number; taskId: number }[]
    >([]);

    const signals = reactive({
        activeCells,
    });

    //--- events ---
    const onDragOver = (cellId: number, resourceId: number, taskId: number) => {
        const hasSameCell = activeCells.value.find(
            (e) => e.cellId === cellId && e.resourceId === resourceId
        );
        if (hasSameCell) return;
        targetResourceId.value = resourceId;
        activeCells.value = [
            ...activeCells.value,
            { cellId, resourceId, taskId },
        ];
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

    const findTask = {
        byId: (id: number): Task | undefined => {
            const resource = findResource.byTaskId(id);
            if (!resource) return;
            const task = resource?.tasks.find((task: Task) => task.id === id);
            if (!task) return;
            return task;
        },
        index: (id: number): number | undefined => {
            const resource = findResource.byTaskId(id);
            if (!resource) return;
            return resource.tasks.findIndex((task) => task.id === id);
        },
    };

    return {
        resources,
        tasks,
        currentTaskId,
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
