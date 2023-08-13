import api from "@/api/instance";

export default {
  state: {
    selectedStore: {},
    storeContentDialog: false,
    mapItem: {},
  },
  mutations: {
    setSelectedStore(state, payload) {
      state.selectedStore = payload
    },
    setStoreContentDialogVisible(state, payload) {
      state.storeContentDialog = payload
    },
    setMapItem(state, payload) {
      state.mapItem = payload
    },
    updateCutterInStore(state, payload) {
      const temp = state.selectedStore.cutterTools.filter(cutterItem => cutterItem.cutterTool.id !== payload.cutterTool.id);
      temp.push(payload);
      state.selectedStore.cutterTools = temp;
    },
    updateMeasureInStore(state, payload) {
      const temp = state.selectedStore.measureTools.filter(measureItem => measureItem.measureTool.id !== payload.measureTool.id);
      temp.push(payload);
      state.selectedStore.measureTools = temp;
    },
    updateToolingInStore(state, payload) {
      const temp = state.selectedStore.toolings.filter(tooling => tooling.tooling.id !== payload.tooling.id);
      temp.push(payload);
      state.selectedStore.toolings = temp;
    },
    updateSpecialInStore(state, payload) {
      const temp = state.selectedStore.specialTools.filter(special => special.specialTool.id !== payload.specialTool.id);
      temp.push(payload);
      state.selectedStore.specialTools = temp;
    },
    updateWorkpieceInStore(state, payload) {
      const temp = state.selectedStore.workpieces.filter(workpiece => workpiece.workpiece.id !== payload.workpiece.id);
      temp.push(payload);
      state.selectedStore.workpieces = temp;
    }
  },
  getters: {
    getSelectedStore: (state) => state.selectedStore,
    isStoreContentDialogVisible: (state) => state.storeContentDialog,
    getMapItem: (state) => state.mapItem,
  },
  actions: {
    async saveStore({dispatch, commit}, {store, area}) {
      if (store.id !== undefined) {
        return api.put(`/store/${store.id}`, store)
          .then(response => {
            dispatch("fetchAreaById", area.id);
            commit("setSelectedStore", response.data);
          })
          .catch(error => {
            console.error(error)
          })
      } else {
        return api.post(`/store/area/${area.id}`, store)
          .then(response => {
            dispatch("fetchAreaById", area.id);
            commit("setSelectedStore", response.data);
          })
          .catch(error => {
            console.error(error)
          })
      }
    },
    async deleteStore({dispatch}, {store, areaId}) {
      try {
        await api.delete(`/store/${store.id}`);
        dispatch("fetchAreaById", areaId);
      } catch (error) {
        if (error.response && error.response.status === 404) {
          console.log('Склад не найден');
        }
      }
    },
  },
}
