import {defineStore} from "pinia";
import ToolStore from "@/pinia-store/ToolStore";


export const useToolingStore
    = defineStore("tooling", () => new ToolStore<Tool>("/tooling"));

