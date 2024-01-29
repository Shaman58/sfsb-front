import {defineStore} from "pinia";
import ToolStore from "@/pinia-store/ToolStore";


export const useToolingStore
    = defineStore("tooling", () => new ToolStore<Tool>("/tooling"));

export const useCuttersStore
    = defineStore("cutters", () => new ToolStore<Tool>("/cutter"))

export const useSpecialStore
    = defineStore("specials", () => new ToolStore<Tool>("/special"))

export const useMaterialsStore
    = defineStore("materials", () => new ToolStore<Material>("/material"))
