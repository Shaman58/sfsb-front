<template>
  <v-btn @click="visible=true"
         color="orange-darken-1" variant="text">
    Редактировать базу инструмента
  </v-btn>
  <tool-list v-if="cutters && cutters.length"
             :visible="visible"
             :tools="cutters"
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
  store.dispatch("fetchCutters");
});

const visible = ref(false);

const store = useStore();

const cutters = computed(() => store.getters.getCutters);

const save = (data) => {
  store.dispatch("saveCutter", data);
};

const remove = ((data) => {
  store.dispatch("deleteCutter", data);
});

</script>
