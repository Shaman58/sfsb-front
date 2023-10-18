<template>
  <v-btn @click="visible=true"
         color="orange-darken-1" variant="text">
    Редактировать базу оснастки
  </v-btn>
  <tool-list v-if="toolings && toolings.length"
             :visible="visible"
             :tools="toolings"
             @hide="visible=false"
             @save="save($event)"
             @remove="remove($event)"
  />

</template>

<script setup>
import {useStore} from "vuex";
import {computed, onMounted, ref} from "vue";
import ToolList from "@/components/tool/ToolList.vue";

onMounted(() => {
  store.dispatch("fetchToolings");
});

const visible = ref(false);

const store = useStore();

const toolings = computed(() => store.getters.getToolings);


const save = (data) => {
  store.dispatch("saveTooling", data);
};

const remove = ((data) => {
  store.dispatch("deleteTooling", data);
});

</script>
