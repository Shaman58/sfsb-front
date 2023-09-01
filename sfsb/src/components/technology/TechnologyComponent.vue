<template>
  <v-container>
    <technology-list-dialog/>
    <technology-create-dialog/>
  </v-container>
</template>

<script setup>

import {onMounted} from 'vue';
import {useStore} from 'vuex';
import TechnologyListDialog from "@/components/technology/TechnologyListDialog.vue";
import TechnologyCreateDialog from "@/components/technology/TechnologyCreateDialog.vue";

const store = useStore();

onMounted(() => {
  store.dispatch("fetchEmployees");
  store.dispatch("fetchMaterials");
  store.dispatch("fetchAllUnits");
  store.dispatch("fetchMeasurers");
  store.dispatch("fetchToolings");
  store.dispatch("fetchSpecials");
  store.dispatch("fetchItems");
  store.dispatch("fetchOperations");
});

</script>
