<template>
  <v-btn @click="visible=true"
         color="orange-darken-1" variant="text">
    Редактировать базу материалов
  </v-btn>
  <material-list-dialog v-if="materials && materials.length && templates && templates.length"
                        :visible="visible"
                        :materials="materials"
                        :templates="templates"
                        @hide="visible=false"
                        @save="save($event)"
                        @remove="remove($event)"
  />

</template>

<script setup>
import {useStore} from "vuex";
import {computed, onMounted, ref} from "vue";
import MaterialListDialog from "@/components/material/MaterialList.vue";
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
