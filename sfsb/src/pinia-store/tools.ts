import {defineStore} from "pinia";
import ToolStore from "@/pinia-store/ToolStore";
import {computed, Ref} from "vue";

interface SwitchTab {
    id: number;
    path: string;
    name: string;
    list: Material[] | Tool[];
    type: "Tool" | "Material";
    save: (item: any) => Promise<void>;
    fetch: () => Promise<void>;
    newData: () => Promise<void>;
    loading: Ref<boolean>
}

export const useToolingStore
    = defineStore("tooling", () => new ToolStore<Tool>("/tooling"));

export type ToolingStoreType = typeof useToolingStore


export const useCuttersStore
    = defineStore("cutters", () => new ToolStore<Tool>("/cutter"))
export type CuttersStoreType = typeof useCuttersStore

export const useSpecialStore
    = defineStore("specials", () => new ToolStore<Tool>("/special"))
export type SpecialStoreType = typeof useSpecialStore

export const useMaterialsStore
    = defineStore("materials", () => new ToolStore<Material>("/material"))
export type MaterialsStoreType = typeof useMaterialsStore

export const useSwitches = () => computed(() => [
    {
        id: 1,
        path: "/data/materials",
        name: "Материалы",
        list: useMaterialsStore().tools,
        type: "Material",
        save: useMaterialsStore().saveTool,
        fetch: useMaterialsStore().fetchTool,
        newData: useMaterialsStore().newData,
        loading: useMaterialsStore().loading
    },
    {
        id: 2,
        path: "/data/cutters",
        name: "Инструменты",
        list: useCuttersStore().tools,
        type: "Tool",
        save: useCuttersStore().saveTool,
        fetch: useCuttersStore().fetchTool,
        newData: useCuttersStore().newData,
        loading: useCuttersStore().loading
    },
    {
        id: 3,
        path: "/data/specials",
        name: "Специнструменты",
        list: useSpecialStore().tools,
        type: "Tool",
        save: useSpecialStore().saveTool,
        fetch: useSpecialStore().fetchTool,
        newData: useSpecialStore().newData,
        loading: useSpecialStore().loading
    },
    {
        id: 4,
        path: "/data/toolings",
        name: "Остастка",
        list: useToolingStore().tools,
        type: "Tool",
        save: useToolingStore().saveTool,
        fetch: useToolingStore().fetchTool,
        newData: useToolingStore().newData,
        loading: useToolingStore().loading
    },
])

