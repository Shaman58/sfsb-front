import { defineStore } from "pinia";
import api from "@/api/instance";
import { useToast } from "vue-toast-notification";
import { Ref, ref } from "vue";
import checkStatus from "@/mixins/CheckStatus";

const toast = useToast();

export const useMaterialTemplatesStore = defineStore(
    "material-templates",
    () => {
        const materialTemplates: Ref<Material[]> = ref([]);

        const fetchMaterialTemplates = async () => {
            try {
                const response = await api.get("/material-density-template");
                checkStatus(response)
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
