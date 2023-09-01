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

<script>
import MaterialListDialog from "@/components/material/MaterialListDialog.vue";
import store from "@/store";
import MaterialCreateDialog from "@/components/material/MaterialCreateDialog.vue";

export default {
  name: "material-component",
  components: {MaterialCreateDialog, MaterialListDialog},
  setup() {

    const showMaterialList = () => {
      store.commit("setMaterialListVisible", true);
    }

    return {
      showMaterialList
    }
  },
  mounted() {
    this.$store.dispatch("fetchMaterials");
    this.$store.dispatch("fetchMaterialTemplates");
  },
}
</script>
