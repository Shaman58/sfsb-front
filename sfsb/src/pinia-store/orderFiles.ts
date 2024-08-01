import { defineStore } from "pinia";
import { ref } from "vue";
import api, { query } from "@/api/instance";
import { useToast } from "vue-toast-notification";

const toast = useToast();

const useOrderFiles = defineStore("orderFiles", () => {
    const files = ref<FileOrder[]>([]);
    const loading = ref(false);
    const error = ref("");

    const getAllFilesByOrder = async (orderId?: number) => {
        if (!orderId) {
            files.value = [];
            return;
        }
        loading.value = true;
        files.value =
            (await query<FileOrder[]>(
                async () => await api.get(`/file/order/${orderId}`),
                { success: "" }
            )) || ([] as FileOrder[]);
        loading.value = false;
    };

    const saveFile = async (orderId: number | undefined, file: FormData) => {
        if (!orderId) {
            error.value =
                "Вы пытаетесь загрузить файлы в несахраненный заказ. Сначала следует сохранить заказ";
            return toast.error(
                "Вы пытаетесь загрузить файлы в несахраненный заказ. Сначала следует сохранить заказ"
            );
        }
        loading.value = true;
        await query(async () => await api.post(`/file/order/${orderId}`, file));
        await getAllFilesByOrder(orderId);
        loading.value = false;
    };
    const deleteFile = async (orderId: number | undefined, id: number) => {
        if (!orderId) {
            return toast.error("Вы пытаетесь удалить пустой заказ");
        }
        loading.value = true;
        await query(async () => await api.delete(`/file/${id}`));
        await getAllFilesByOrder(orderId);
        loading.value = false;
    };

    const clearError = () => (error.value = "");
    return {
        files,
        loading,
        error,
        getAllFilesByOrder,
        saveFile,
        deleteFile,
        clearError,
    };
});
export default useOrderFiles;
