<template>
  <v-container>
    <v-btn
      @click="showList">
      Редактировать базу специнструмента
    </v-btn>
  </v-container>
  <SpecialListDialog/>
  <SpecialCreateDialog/>
</template>

<script setup>
import {useStore} from "vuex";
import {onMounted} from "vue";
import SpecialCreateDialog from "@/components/special/SpecialCreateDialog.vue";
import SpecialListDialog from "@/components/special/SpecialListDialog.vue";

const showList = () => {
  store.commit("setSpecialListVisible", true);
}

const store = useStore();

onMounted(() => {
  store.dispatch("fetchSpecials");
});

</script>
