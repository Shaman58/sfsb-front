<template>
  <v-btn @click="visible=true"
         color="orange-darken-1" variant="text">
    Редактировать базу операций
  </v-btn>
  <operation-list v-if="operations && operations.length && techPrice.id && setupPrice.id"
                  :visible="visible"
                  :operations="operations"
                  :techPrice="techPrice"
                  :setupPrice="setupPrice"
                  @hide="visible=false"
                  @save="save($event)"
                  @remove="remove($event)"
  />

</template>

<script setup>
import {useStore} from "vuex";
import {computed, onMounted, ref} from "vue";
import OperationList from "@/components/operation/OperationList.vue";
import ToolList from "@/components/tool/ToolList.vue";

onMounted(() => {
  store.dispatch("fetchOperations");
  store.dispatch("fetchSetupPrice");
  store.dispatch("fetchTechPrice");
});

const visible = ref(false);

const store = useStore();

const operations = computed(() => store.getters.getOperations);
const techPrice = computed(() => store.getters.getTechPrice);
const setupPrice = computed(() => store.getters.getSetupPrice);

const save = (data) => {
  if (data.id === 1) {
    store.dispatch("saveSetupPrice", data);
  } else if (data.id === 2) {
    store.dispatch("saveTechPrice", data);
  } else {
    store.dispatch("saveOperation", data);
  }
};

const remove = ((data) => {
  store.dispatch("deleteOperation", data);
});

</script>
