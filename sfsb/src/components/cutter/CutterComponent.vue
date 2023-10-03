<template>
  <v-container>
    <v-btn
      @click="showList">
      Редактировать базу инструмента
    </v-btn>
  </v-container>
  <cutter-list-dialog/>
  <cutter-create-dialog/>
</template>

<script setup>
import {useStore} from "vuex";
import {onMounted} from "vue";
import CutterListDialog from "@/components/cutter/CutterListDialog.vue";
import CutterCreateDialog from "@/components/cutter/CutterCreateDialog.vue";

const showList = () => {
  store.commit("setCutterListVisible", true);
}

const store = useStore();

onMounted(() => {
  store.dispatch("fetchCutters");
});

</script>
