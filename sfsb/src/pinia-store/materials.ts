import { defineStore } from "pinia";
import api from "@/api/instance";
import { useToast } from "vue-toast-notification";
import { Ref, ref } from "vue";
import checkStatus from "@/mixins/CheckStatus";

const toast = useToast();

export const useMaterialsStore = defineStore("materials", () => {
    const materials: Ref<Material[]> = ref([]);

    const fetchMaterials = async () => {
        try {
            const response = await api.get("/material");
            checkStatus(response)
            materials.value = response.data;
        } catch (error) {
            toast.error("Ошибка в получении данных материалов " + error);
        }
    };

    const saveMaterial = async (material: Material) => {
        try {
            const url = material.id ? `/material/${material.id}` : "/material";
            const response = await (material.id
                ? api.put(url, material)
                : api.post(url, material));
            checkStatus(response)
            toast.info("Успешно сохранено!", { position: "top-right" });
            const index = materials.value.findIndex(
                (e) => e.id === material.id
            );
            index !== -1
                ? materials.value.splice(index, 1, material)
                : materials.value.push(material);
        } catch (error) {
            toast.error("Ошибка в сохранении данных материалов " + error);
        }
    };

    const deleteMaterial = async (material: Material) => {
        try {
            const response = await api.delete(`/material/${material.id}`);
            checkStatus(response)
            toast.info("Успешно удален!", { position: "top-right" });
            materials.value = materials.value.filter(
                (e) => e.id !== material.id
            );
        } catch (error) {
            toast.error("Ошибка в удалении данных материалов " + error);
        }
    };

    return {
        materials,
        fetchMaterials,
        saveMaterial,
        deleteMaterial,
    };
});
