<template>
  <v-container>
    <v-btn
      @click="showList">
      Редактировать базу операций
    </v-btn>
  </v-container>
  <OperationListDialog/>
  <OperationCreateDialog/>
</template>

<script setup>
import {useStore} from "vuex";
import {onMounted} from "vue";
import OperationListDialog from "@/components/operation/OperationListDialog.vue";
import OperationCreateDialog from "@/components/operation/OperationCreateDialog.vue";

const showList = () => {
  store.commit("setOperationListVisible", true);
}

const store = useStore();

onMounted(() => {
  store.dispatch("fetchOperations");
  store.dispatch("fetchSetupPrice");
  store.dispatch("fetchTechPrice");
});

</script>
