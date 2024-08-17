import { defineStore } from "pinia";
import { computed, reactive, ref } from "vue";
import { fakeResources } from "@/components/workflow/fakeResources";

export const useWorkflowStore = defineStore("workflow", () => {
    const resources = ref<Resource[]>(fakeResources);
    const resourceObject = computed(() => {
        return resources.value.reduce((acc, resource) => {
            acc[resource.id] = resource;
            return acc;
        }, {} as Record<number, Resource>);
    });
    const tasks = computed(() =>
        resources.value.flatMap((resource) => resource.tasks)
    );
    const taskWillMoveData = reactive<ExtendedTaskWillMoveData>(
        {} as ExtendedTaskWillMoveData
    );
    const _sourceResourceId = ref<number | undefined>(undefined);
    const _targetResourceId = ref<number | undefined>(undefined);

    const sourceResourceId = computed({
        get: () => _sourceResourceId.value,
        set: (id: number | undefined) => {
            _sourceResourceId.value = id;
        },
    });
    const targetResourceId = computed({
        get: () => _targetResourceId.value,
        set: (id: number | undefined) => {
            _targetResourceId.value = id;
        },
    });

    //--- moving ---

    const moveTask = (id: number) => {
        if (!targetResourceId.value || !sourceResourceId.value) return;
        const taskIndex = findTask.index(id);
        if (taskIndex === undefined) return;
        const task = resourceObject.value[sourceResourceId.value].tasks.slice(
            taskIndex,
            1
        )[0];
        resourceObject.value[targetResourceId.value].tasks.push(task);

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
            return resources.value.find((resource) => resource.id === id);
        },
        byTaskId: (id: number) => {
            const resource = resources.value.find((resource) =>
                resource.tasks.find((task: Task) => task.id === id)
            );
            if (!resource) return;
            return resource;
        },
        index: (id: number): number | undefined => {
            return resources.value.findIndex((resource) => resource.id === id);
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
    };
});
