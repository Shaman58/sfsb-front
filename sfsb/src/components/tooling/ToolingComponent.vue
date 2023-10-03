<template>
  <v-container>
    <v-btn
      @click="showList">
      Редактировать базу оснастки
    </v-btn>
  </v-container>
  <tooling-list-dialog/>
  <tooling-create-dialog/>
</template>

<script setup>
import {useStore} from "vuex";
import {onMounted} from "vue";
import ToolingListDialog from "@/components/tooling/ToolingListDialog.vue";
import ToolingCreateDialog from "@/components/tooling/ToolingCreateDialog.vue";

const showList = () => {
  store.commit("setToolingListVisible", true);
}

const store = useStore();

onMounted(() => {
  store.dispatch("fetchToolings");
});

</script>
