import { defineStore } from "pinia";
import { ref } from "vue";
import ordersApi from "@/api/orders";
import { useToast } from "vue-toast-notification";
import workflowApi from "@/api/workflowApi";

export const useOrdersInWorkflow = defineStore("ordersInWorkflow", () => {
    const toast = useToast();
    const operations = ref([]);

    const getOperations = async () => {
        try {
            const res = await ordersApi.get("operations");
            operations.value = res.data;
        } catch (error: any) {
            toast.error(error.data.message);
        }
    };

    const add = async (operation: { name: string; operations: string[] }) => {
        try {
            await workflowApi.post("/create", operation);
        } catch (error: any) {
            toast.error(error.data.message);
        }
    };
    return {
        operations,
        getOperations,
        add,
    };
});
