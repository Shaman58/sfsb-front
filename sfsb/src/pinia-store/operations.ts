import {defineStore} from "pinia";
import {Ref, ref} from "vue";
import {CRUD} from "@/api/instance";


export const useOperationsStore = defineStore("operations", () => {
    const operations: Ref<Operation[]> = ref([])
    const techPrice: Ref<Operation> = ref({} as Operation)
    const setupPrice: Ref<Operation> = ref({} as Operation)

    const crudOperations = new CRUD("/operation")
    const crudTechPrice = new CRUD("/operation/technology")
    const crudSetupPrice = new CRUD("/operation/setup")

    //--- OPERATIONS ---
    const fetchOperation = async () => {
        operations.value = await crudOperations.fetch() as unknown as Operation[]
    }

    const deleteOperation = async (operation: Operation) => {
        operations.value = await crudOperations.deleteAndFetch(operation) || []
    }
    const saveOperation = async (operation: Operation) => {
        operations.value = await crudOperations.saveAndFetch(operation) || []
    }

    //--- techPrice ---
    const fetchTechPrice = async () => techPrice.value = await crudTechPrice.fetch<Operation>() || {} as Operation
    const saveTechPrice = async (operation: Operation) => techPrice.value = await crudTechPrice.saveAndFetch(operation) || {} as Operation
    const deleteTechPrice = async (operation: Operation) => techPrice.value = await crudTechPrice.deleteAndFetch(operation) || {} as Operation
//--- setupPrice ---
    const fetchSetupPrice = async () => setupPrice.value = await crudSetupPrice.fetch<Operation>() || {} as Operation
    const saveSetupPrice = async (operation: Operation) => setupPrice.value = await crudSetupPrice.saveAndFetch(operation) || {} as Operation
    const deleteSetupPrice = async (operation: Operation) => setupPrice.value = await crudSetupPrice.deleteAndFetch(operation) || {} as Operation

    return {
        operations,
        setupPrice,
        techPrice,
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
