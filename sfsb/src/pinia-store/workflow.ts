import { defineStore } from "pinia";
import { computed, reactive, ref } from "vue";
import { fakeResources } from "@/components/workflow/fakeResources";

export const useWorkflowStore = defineStore("workflow", () => {
    const resources = ref<Resource[]>(fakeResources);
    const tasks = computed(() =>
        resources.value.flatMap((resource) => resource.tasks)
    );
    const taskWillMoveData = reactive<ExtendedTaskWillMoveData>(
        {} as ExtendedTaskWillMoveData
    );
    const taskOverResource = ref<number | null>(null);

    //--- find ---
    const find: {
        resource: {
            byId: (id: number) => Resource | undefined;
            byTaskId: (id: number) => Resource | undefined;
            index: (id: number) => number | undefined;
        };
        task?: {
            byId: (id: number) => Task | undefined;
            index: (id: number) => number | undefined;
        };
    } = {
        resource: {
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
                return resources.value.findIndex(
                    (resource) => resource.id === id
                );
            },
        },
    };
    find.task = {
        byId: (id: number): Task | undefined => {
            const resource = find.resource.byTaskId(id);
            if (!resource) return;
            const task = resource?.tasks.find((task: Task) => task.id === id);
            if (!task) return;
            return task;
        },
        index: (id: number): number | undefined => {
            const resource = find.resource.byTaskId(id);
            if (!resource) return;
            return resource.tasks.findIndex((task) => task.id === id);
        },
    };

    return {
        resources,
        tasks,
        taskWillMoveData,
        find,
        taskOverResource,
    };
});
