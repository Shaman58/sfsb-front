import {defineStore} from "pinia";
import ToolStore from "@/pinia-store/ToolStore";
import {computed, type Ref, ref} from "vue";
import {RouteLocationNormalized} from "vue-router";

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
        loading: useMaterialsStore().loading,
        setFilter: useMaterialsStore().setFilter,
        filter: useMaterialsStore().filter
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
        loading: useCuttersStore().loading,
        setFilter: useCuttersStore().setFilter,
        filter: useCuttersStore().filter
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
        loading: useSpecialStore().loading,
        setFilter: useSpecialStore().setFilter,
        filter: useSpecialStore().filter
    },
    {
        id: 4,
        path: "/data/toolings",
        name: "Оснастка",
        list: useToolingStore().tools,
        type: "Tool",
        save: useToolingStore().saveTool,
        fetch: useToolingStore().fetchTool,
        newData: useToolingStore().newData,
        loading: useToolingStore().loading,
        setFilter: useToolingStore().setFilter,
        filter: useToolingStore().filter
    },
])

export const useCurrentTool = defineStore("currentTool", () => {
    const currentRoute: Ref<RouteLocationNormalized | null> = ref(null)
    const switchTool = useSwitches()
    const currentTool = computed({
        get: () => {
            const res = switchTool.value.find(e => e.name === currentRoute.value?.meta.name)
            return res
        },
        set: () => {
        }
    })

    const setCurrentRoute = (route: RouteLocationNormalized) => {
        currentRoute.value = route
    }


    return {
        currentTool,
        setCurrentRoute
    }
})
