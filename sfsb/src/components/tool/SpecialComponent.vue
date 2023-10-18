<template>
  <v-btn @click.stop="visible=true"
         color="orange-darken-1" variant="text">
    Редактировать базу специнструмента
  </v-btn>
  <tool-list v-if="specials && specials.length"
             :visible="visible"
             :tools="specials"
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
  store.dispatch("fetchSpecials");
});

const visible = ref(false);

const store = useStore();

const specials = computed(() => store.getters.getSpecials);


const save = (data) => {
  store.dispatch("saveSpecial", data);
};

const remove = ((data) => {
  store.dispatch("deleteSpecial", data);
});

</script>
