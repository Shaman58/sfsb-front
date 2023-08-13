<template>
  <v-dialog v-model="isMaterialListVisible">
    <v-card
      title="Список материалов">
      <v-list>
        <v-list-item
          v-for="item in materials"
          :key="item.id"
          :title="item.materialName"
          @click="showNewMaterialDialog(item)">

          <template v-slot:append>
            <v-btn
              color="orange-lighten-1"
              icon="mdi-delete"
              variant="text"
              @click.stop="deleteMaterial(item)"
            ></v-btn>
          </template>

        </v-list-item>

        <v-list-item :title="'...'">

          <template v-slot:append>
            <v-btn
              color="orange-lighten-1"
              icon="mdi-plus"
              variant="text"
              @click.stop="showNewMaterialDialog({})"
            ></v-btn>
          </template>

        </v-list-item>
      </v-list>

      <v-card-actions>
        <v-spacer/>
        <v-btn
          color="orange-darken-1"
          variant="text"
          @click="hideMaterialList">
          Закрыть
        </v-btn>
      </v-card-actions>

    </v-card>
  </v-dialog>
</template>

<script>
import {computed} from "vue";
import {useStore} from "vuex";

export default {
  name: "material-list-dialog",
  setup() {
    const store = useStore();

    const isMaterialListVisible = computed(() => store.getters.getMaterialListVisible);

    const materials = computed(() => store.getters.getMaterials);

    const deleteMaterial = ((item) => {
      store.dispatch("deleteMaterial", item);
    });

    const hideMaterialList = (() => {
      store.commit("setMaterialListVisible", false)
    });

    const showNewMaterialDialog = ((item) => {
      store.commit("setMaterial", item);
      store.commit("setMaterialDialogVisible", true);
    });

    return {
      isMaterialListVisible,
      materials,
      deleteMaterial,
      hideMaterialList,
      showNewMaterialDialog
    }
  }
}
</script>
