<template>
  <v-list density="compact">
    <v-list-item v-for="store in area.stores" :key="store.id" :value="store">
      <v-list-item-title @click="selectStore(store)">
        <v-list-subheader>№ {{ store.storeName }}</v-list-subheader>
      </v-list-item-title>
      <template v-slot:append>
        <v-btn
          color="orange-lighten-1"
          icon="mdi-delete"
          variant="text"
          @click="deleteStore(store)"
          :disabled="isDeleteStoreActive(store)"
        ></v-btn>
      </template>
    </v-list-item>
    <v-list-item>
      <v-list-item-title>
        ...
      </v-list-item-title>
      <template v-slot:append>
        <v-btn
          color="orange-lighten-1"
          icon="mdi-plus"
          variant="text"
          @click="selectStore({cutterTools:[],measureTools: [],specialTools: [], toolings:[], workpieces:[], storeName:''})"
        ></v-btn>
      </template>
    </v-list-item>
  </v-list>
</template>

<script>
import {useStore} from "vuex";
import {computed} from "vue";

export default {
  name: "store-list-card",
  setup() {
    const store = useStore();

    const area = computed(() => store.getters.getSelectedArea);

    const deleteStore = (selectedStore) => {
      store.dispatch("deleteStore", {store: selectedStore, areaId: area.value.id});
    };

    const isDeleteStoreActive = (selectedStore) => {
      return selectedStore.cutterTools.length !== 0 || selectedStore.measureTools.length !== 0 ||
        selectedStore.toolings.length !== 0 || selectedStore.workpieces.length !== 0 ||
        selectedStore.specialTools.length !== 0
    };

    const selectStore = (selectedStore) => {
      store.commit("setSelectedStore", {...selectedStore});
      store.commit("setStoreContentDialogVisible", true);
    };

    return {
      area,
      deleteStore,
      selectStore,
      isDeleteStoreActive
    };
  },
}
</script>
