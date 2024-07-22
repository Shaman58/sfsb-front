import {defineStore} from "pinia";
import {Ref, ref} from "vue";
import {CRUD} from "@/api/instance";


export const useOperationsStore = defineStore("operations", () => {
    const loading = ref(false);
    const operations: Ref<Operation[]> = ref([])
    const techPrice: Ref<Operation> = ref({} as Operation)
    const setupPrice: Ref<Operation> = ref({} as Operation)

    const crudOperations = new CRUD("/operation")
    const crudTechPrice = new CRUD("/operation/technology")
    const crudSetupPrice = new CRUD("/operation/setup")

    const withLoading = async (cb: () => void | Promise<any>) => {
        loading.value = true
        await cb()
        loading.value = false
    }


    //--- OPERATIONS ---
    const fetchOperation = async () => await withLoading(async () => operations.value = await crudOperations.fetch() as unknown as Operation[])


    const deleteOperation = async (operation: Operation) => {
        await withLoading(async () => operations.value = await crudOperations.deleteAndFetch(operation) || [])
    }
    const saveOperation = async (operation: Operation) => {
        await withLoading(async () => operations.value = await crudOperations.saveAndFetch(operation) || [])
    }

    //--- techPrice ---
    const fetchTechPrice = async () => await withLoading(async () => techPrice.value = await crudTechPrice.fetch<Operation>() || {} as Operation)
    const saveTechPrice = async (operation: Operation) => await withLoading(async () => techPrice.value = await crudTechPrice.saveAndFetch(operation) || {} as Operation)
    const deleteTechPrice = async (operation: Operation) => await withLoading(async () => techPrice.value = await crudTechPrice.deleteAndFetch(operation) || {} as Operation)
//--- setupPrice ---
    const fetchSetupPrice = async () => await withLoading(async () => setupPrice.value = await crudSetupPrice.fetch<Operation>() || {} as Operation)
    const saveSetupPrice = async (operation: Operation) => await withLoading(async () => setupPrice.value = await crudSetupPrice.saveAndFetch(operation) || {} as Operation)
    const deleteSetupPrice = async (operation: Operation) => await withLoading(async () => setupPrice.value = await crudSetupPrice.deleteAndFetch(operation) || {} as Operation)

    return {
        operations,
        setupPrice,
        techPrice,
        loading,
        fetchOperation,
        saveOperation,
        deleteOperation,
        fetchTechPrice,
        saveTechPrice,
        deleteTechPrice,
        fetchSetupPrice,
        saveSetupPrice,
        deleteSetupPrice
    }
});
