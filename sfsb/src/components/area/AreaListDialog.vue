<template>
  <v-container>
    <v-dialog v-model="areaDialogVisible" width="800">
      <v-card>
        <v-card-title>
          <span class="text-h5">{{ area.areaName }}</span>
        </v-card-title>
        <unit-list-card/>
<!--        <v-divider/>-->
<!--        <store-list-card/>-->
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="orange-darken-1" variant="text" @click="hideAreaDialog">Закрыть</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import {useStore} from "vuex";
import {computed} from "vue";
import UnitListCard from "@/components/unit/UnitListCard.vue";
import StoreListCard from "@/components/store/StoreListCard.vue";

export default {
  name: "area-list-dialog",
  components: {StoreListCard, UnitListCard},
  setup() {
    const store = useStore();

    const areaDialogVisible = computed(() => store.getters.isAreaDialogVisible);
    const area = computed(() => store.getters.getSelectedArea);
    const hideAreaDialog = () => {
      store.commit("setAreaDialog", false);
    };

    return {
      areaDialogVisible,
      hideAreaDialog,
      area
    };
  },
}
</script>
