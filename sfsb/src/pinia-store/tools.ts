import {defineStore} from "pinia";
import ToolStore from "@/pinia-store/ToolStore";


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
