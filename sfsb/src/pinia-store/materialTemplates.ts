import { defineStore } from "pinia";
import api from "@/api/instance";
import { useToast } from "vue-toast-notification";
import { Ref, ref } from "vue";

const toast = useToast();

export const useMaterialTemplatesStore = defineStore(
    "material-templates",
    () => {
        const materialTemplates: Ref<Material[]> = ref([]);

        const fetchMaterialTemplates = async () => {
            try {
                const response = await api.get("/material-density-template");
                if (response.status > 400) throw new Error(response.statusText);
                materialTemplates.value = response.data;
            } catch (error) {
                toast.error("Ошибка в получении шаблонов материалов " + error);
            }
        };

        return {
            materialTemplates,
            fetchMaterialTemplates,
        };
    }
);
