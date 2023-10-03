import api from "@/api/instance";

export default {
  state: {
    cutters: [],
    cutter: {},
    cutterListVisible: false,
    cutterDialogVisible: false,
  },
  mutations: {
    setCutters(state, payload) {
      state.cutters = payload;
    },
    setCutter(state, payload) {
      state.cutter = payload;
    },
    saveCutter(state, payload) {
      const index = state.cutters.findIndex(item => item.id === payload.id);
      if (index !== -1) {
        state.cutters.splice(index, 1, payload);
      } else {
        state.cutters.push(payload)
      }
    },
    setCutterListVisible(state, payload) {
      state.cutterListVisible = payload;
    },
    setCutterDialogVisible(state, payload) {
      state.cutterDialogVisible = payload;
    },
    deleteCutter(state, payload) {
      state.cutters = state.cutters.filter(cutter => cutter.id !== payload.id);
    },
  },
  getters: {
    getCutters: (state) => state.cutters,
    getCutter: (state) => state.cutter,
    getCutterListVisible: (state) => state.cutterListVisible,
    getCutterDialogVisible: (state) => state.cutterDialogVisible,
  },
  actions: {
    async fetchCutters({commit}) {
      try {
        const response = await api.get('/cutter');
        commit("setCutters", response.data);
      } catch (error) {
        console.log("Инструмент не найден");
        console.error(error);
      }
    },
    async saveCutter({commit}, cutter) {
      try {
        const url = cutter.id
          ? `/cutter/${cutter.id}`
          : '/cutter';

        const response = await (cutter.id ? api.put(url, cutter) : api.post(url, cutter));
        commit("saveCutter", response.data);
        return response.data;
      } catch (error) {
        console.log("Инструмент не создан");
        console.error(error);
      }
    },
    async deleteCutter({commit}, cutter) {
      try {
        await api.delete(`/cutter/${cutter.id}`);
        commit("deleteCutter", cutter);
      } catch (error) {
        console.log("Инструмент не удален");
        console.error(error);
      }
    },
  },
}
