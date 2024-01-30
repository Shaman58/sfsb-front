import {computed, Ref} from "vue";
import {storeToRefs} from "pinia";
import {
    type CuttersStoreType,
    type  MaterialsStoreType,
    type SpecialStoreType,
    type ToolingStoreType
} from "@/pinia-store/tools";


interface SwitchTab {
    id: number;
    path: string;
    name: string;
    list: Material[] | Tool[];
    type: "Tool" | "Material";
    save: (item: any) => Promise<void>;
    fetch: () => Promise<void>;
    newData: () => Promise<void>;
}

const useSwitches = (useCuttersStore: CuttersStoreType,
                     useMaterialsStore: MaterialsStoreType,
                     useSpecialStore: SpecialStoreType,
                     useToolingStore: ToolingStoreType) => {

    const {tools: materials} = storeToRefs(useMaterialsStore())
    const {tools: toolings} = storeToRefs(useToolingStore())
    const {tools: cutters} = storeToRefs(useCuttersStore())
    const {tools: specials} = storeToRefs(useSpecialStore())

    const {fetchTool: fetchMaterials, saveTool: saveMaterial, newData: newDataMaterials} = useMaterialsStore()
    const {fetchTool: fetchToolings, saveTool: saveToolings, newData: newDataToolings} = useToolingStore()
    const {fetchTool: fetchCutters, saveTool: saveCutter, newData: newDataCutters} = useCuttersStore()
    const {fetchTool: fetchSpecials, saveTool: saveSpecial, newData: newDataSpecials} = useSpecialStore()


    const switches: Ref<SwitchTab[]> = computed(() => [
        {
            id: 1,
            path: "/data/materials",
            name: "Материалы",
            list: materials.value,
            type: "Material",
            save: saveMaterial,
            fetch: fetchMaterials,
            newData: newDataMaterials
        },
        {
            id: 2,
            path: "/data/cutters",
            name: "Инструменты",
            list: cutters.value,
            type: "Tool",
            save: saveCutter,
            fetch: fetchCutters,
            newData: newDataCutters
        },
        {
            id: 3,
            path: "/data/specials",
            name: "Специнструменты",
            list: specials.value,
            type: "Tool",
            save: saveSpecial,
            fetch: fetchSpecials,
            newData: newDataSpecials
        },
        {
            id: 4,
            path: "/data/toolings",
            name: "Остастка",
            list: toolings.value,
            type: "Tool",
            save: saveToolings,
            fetch: fetchToolings,
            newData: newDataToolings
        },
    ])
    return switches
}

export default useSwitches
