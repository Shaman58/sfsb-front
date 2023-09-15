<template>
  <v-container>
    <v-btn
      @click="showMaterialList">
      Редактировать базу материалов
    </v-btn>
  </v-container>
  <material-list-dialog/>
  <material-create-dialog/>
</template>

<script setup>
import {useStore} from "vuex";
import {onMounted} from "vue";
import MaterialListDialog from "@/components/material/MaterialListDialog.vue";
import MaterialCreateDialog from "@/components/material/MaterialCreateDialog.vue";

const showMaterialList = () => {
  store.commit("setMaterialListVisible", true);
}

const store = useStore();

onMounted(() => {
  store.dispatch("fetchMaterials");
  store.dispatch("fetchMaterialTemplates");
});

</script>
