<template>
  <v-btn @click="visible=true"
         color="orange-darken-1" variant="text">
    Редактировать базу материалов
  </v-btn>

  <material-list-dialog1 v-model:visible="visible"/>

</template>

<script setup>
import {useStore} from "vuex";
import {computed, onMounted, ref} from "vue";
import MaterialListDialog from "@/components/material/MaterialList.vue";
import MaterialListDialog1 from "@/components/material/MaterialList1.vue";
import ToolList from "@/components/tool/ToolList.vue";

onMounted(() => {
  store.dispatch("fetchMaterials");
  store.dispatch("fetchMaterialTemplates");
});

const visible = ref(false);

const store = useStore();

const materials = computed(() => store.getters.getMaterials);
const templates = computed(() => store.getters.getMaterialTemplates);

const save = (data) => {
  store.dispatch("saveMaterial", data);
};

const remove = ((data) => {
  store.dispatch("deleteMaterial", data);
});

</script>
