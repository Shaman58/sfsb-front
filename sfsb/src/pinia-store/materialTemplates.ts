import {defineStore} from "pinia";
import api, {query} from "@/api/instance";
import {Ref, ref} from "vue";

export const useMaterialTemplatesStore = defineStore(
    "material-templates",
    () => {
        const materialTemplates: Ref<Material[]> = ref([]);
        const loading: Ref<boolean> = ref(false)
        const fetchMaterialTemplates = async () => {
            loading.value = true
            materialTemplates.value = await query<Material[]>(async () => await api.get("/material-density-template"), {success: ""}) || []
            loading.value = false
        };

        return {
            materialTemplates,
            loading,
            fetchMaterialTemplates,
        };
    }
);
