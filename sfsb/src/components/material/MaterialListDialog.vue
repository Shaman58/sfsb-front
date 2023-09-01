<template>
  <v-dialog v-model="isMaterialListVisible">
    <v-card>
      <v-card-title>
        <v-row>
          <v-col cols="4">
            <v-select
              label="Выберите вид:"
              :items="geometries"
              item-text="title"
              v-model="geometry"
              item-value="label">
            </v-select>
          </v-col>
          <v-col cols="4">
            <v-text-field
              label="Фильтр:"
              v-model="materialFilter">
            </v-text-field>
          </v-col>
        </v-row>
      </v-card-title>
      <v-list>
        <v-list-item
          v-for="item in filteredMaterials"
          :key="item.id"
          :title="formatObjectData(item)"
          @click="showNewMaterialDialog({...item})">

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
              @click.stop="showNewMaterialDialog({price:{currency:'RUB', amount:0}})"
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
import {computed, ref} from "vue";
import {useStore} from "vuex";
import materialDataFormatting from '@/mixins/MaterialDataFormatting'

export default {
  name: "material-list-dialog",
  setup() {
    const store = useStore();
    const {geometries, formatObjectData} = materialDataFormatting();

    const geometry = ref(null);
    const materialFilter = ref(null);

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

    const filteredMaterials = computed(() => {
      return materials.value.filter((item) => {
        return (
          (!geometry.value || item.geometry === geometry.value) &&
          (!materialFilter.value || item.materialName.toLowerCase().includes(materialFilter.value.toLowerCase()) || item.gost.toLowerCase().includes(materialFilter.value.toLowerCase()))
        );
      });
    });

    return {
      isMaterialListVisible,
      filteredMaterials,
      deleteMaterial,
      hideMaterialList,
      showNewMaterialDialog,
      formatObjectData,
      geometries,
      materialFilter,
      geometry,
    }
  }
}
</script>
