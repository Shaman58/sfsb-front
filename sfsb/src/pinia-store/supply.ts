import {defineStore} from "pinia";
import api from "@/api/instance";
import {useToast} from "vue-toast-notification";
import {ref} from "vue";

const toast = useToast();

export const useSupplyStore = defineStore("supply", () => {
    const materialsNoCost = ref<Material[]>([] as Material[]);
    const materialsDateExpired = ref<Material[]>([] as Material[]);
    const materialsAll = ref<Material[]>([] as Material[]);

    const getMaterialsNoCost = async () => {
        try {
            const {data} = await api.get<Material[]>(`/material/no-cost`);
            materialsNoCost.value = data;
        } catch (error) {
            toast.error("Ошибка при загрузке данных материалов");
        }
    };
    const getMaterialsDateExpired = async () => {
        try {
            const {data} = await api.get<Material[]>(
                `/material/date-expired`
            );
            materialsDateExpired.value = data;
        } catch (error) {
            toast.error("Ошибка при загрузке данных материалов");
        }
    };
    const getMaterialsAll = async () => {
        try {
            const {data} = await api.get<Material[]>(`/material`);
            materialsAll.value = data;
        } catch (error) {
            toast.error("Ошибка при загрузке данных материалов");
        }
    };

    const saveMaterial = async (material: Material) => {
        try {
            const responce = await api.put(
                `/material/${material.id}/price`,
                material
            );
            if (responce.status === 200) {
                toast.success("Данные обновлены");
                await getMaterialsAll();
                await getMaterialsNoCost();
                await getMaterialsDateExpired();
                return;
            }
            throw new Error(responce.statusText);
        } catch (error) {
            toast.error("Ошибка при отправке данных ");
        }
    };

    return {
        materialsNoCost,
        materialsDateExpired,
        materialsAll,
        getMaterialsNoCost,
        getMaterialsDateExpired,
        getMaterialsAll,
        saveMaterial,
    };
});

export type SupplyStoreType = typeof useSupplyStore
