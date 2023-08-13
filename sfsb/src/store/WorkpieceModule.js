import api from "@/api/instance";

export default {
  state: {
    workpieces: [],
    workpiece: {
      price: {}
    },
    workpieceDialogVisible: false,
    workpieceCreateDialogVisible: false,
    workpieceDialogFromItem: true
  },
  mutations: {
    setWorkpieces(state, payload) {
      state.workpieces = payload;
    },
    setWorkpiece(state, payload) {
      state.workpiece = payload;
    },
    setWorkpieceDialogVisible(state, payload) {
      state.workpieceDialogVisible = payload
    },
    setWorkpieceCreateDialogVisible(state, payload) {
      state.workpieceCreateDialogVisible = payload;
    },
    setWorkpieceDialogFromItem(state, payload) {
      state.workpieceDialogFromItem = payload;
    },
    saveWorkpieceToWorkpieces(state, payload) {
      const index = state.workpieces.findIndex((workpiece) => workpiece.id === payload.id);
      if (index !== -1) {
        state.workpieces.splice(index, 1, payload);
      } else {
        state.workpieces.push(payload);
      }
    },
  },
  getters: {
    getWorkpieces: (state) => state.workpieces,
    getWorkpiece: (state) => state.workpiece,
    isWorkpieceCreateDialogVisible: (state) => state.workpieceCreateDialogVisible,
    isWorkpieceDialogVisible: (state) => state.workpieceDialogVisible,
    isWorkpieceDialogFromItem: (state) => state.workpieceDialogFromItem,
  },
  actions: {
    async fetchWorkpieces({commit}) {
      try {
        const response = await api.get('/workpiece');
        commit("setWorkpieces", response.data);
      } catch (error) {
        console.log("Заготовки не найдены");
        console.error(error);
      }
    },
    async saveWorkpiece({commit}, workpiece) {
      try {
        const url = workpiece.id
          ? `/workpiece/${workpiece.id}`
          : '/workpiece';

        const response = await (workpiece.id ? api.put(url, workpiece) : api.post(url, workpiece));
        commit("setWorkpiece", response.data)
        commit("saveWorkpieceToWorkpieces", response.data);
        commit("setMapItem", {workpiece: response.data});
        return response.data;
      } catch (error) {
        console.log("Заготовка не создана");
        console.error(error);
      }
    },
  },
}
