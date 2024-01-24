import {defineStore} from "pinia";
import api, {query} from "@/api/instance";
import {useToast} from "vue-toast-notification";
import {Ref, ref} from "vue";
import {Axios} from "axios";

const toast = useToast();

export const useMaterialsStore = defineStore("materials", () => {
    const materials: Ref<Material[]> = ref([]);
    const loading: Ref<boolean> = ref(false)
    const fetchMaterials = async () => {
        loading.value = true
        materials.value = await query<Material[]>(async () => await api.get("/material"), {success: ""}) || []
        loading.value = false
    };

    const saveMaterial = async (material: Partial<Material>) => {
        const url = material.id ? `/material/${material.id}` : "/material";
        const method: keyof Axios = material.id ? "put" : "post"
        loading.value = true
        await query<Material>(async () => await api[method](url, material))
        await fetchMaterials()
        loading.value = false
    };

    const deleteMaterial = async (material: Material) => {
        loading.value = true
        await query(async () => await api.delete(`/material/${material.id}`))
        loading.value = false
    };

    return {
        materials,
        loading,
        fetchMaterials,
        saveMaterial,
        deleteMaterial,
    };
});
