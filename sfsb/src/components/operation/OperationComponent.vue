<template lang="pug">
    v-btn(@click="visible=true" color="orange-darken-1" variant="text") Редактировать базу операций
    operation-list(v-if="operations && operations.length && techPrice.id && setupPrice.id" :visible="visible" :operations="operations" :techPrice="techPrice" :setupPrice="setupPrice" @hide="visible=false" @save="save($event)" @remove="remove($event)")

</template>

<script setup lang="ts">
import {ref} from "vue";
import OperationList from "@/components/operation/OperationList.vue";
import {storeToRefs} from "pinia";
import {useOperationsStore} from "@/pinia-store/operations";

const {operations, techPrice, setupPrice} = storeToRefs(useOperationsStore())
const {
    fetchOperation,
    saveOperation,
    deleteOperation,
    fetchTechPrice,
    saveTechPrice,
    deleteTechPrice,
    fetchSetupPrice,
    saveSetupPrice,
    deleteSetupPrice
} = useOperationsStore()

await fetchOperation()
await fetchTechPrice()
await fetchSetupPrice()

const visible = ref(false);
const save = (data: Operation) => {
    if (data.id === 1) {
        store.dispatch("saveSetupPrice", data);
    } else if (data.id === 2) {
        store.dispatch("saveTechPrice", data);
    } else {
        store.dispatch("saveOperation", data);
    }
};

const remove = async (data: Operation) => await deleteOperation(data);


</script>
