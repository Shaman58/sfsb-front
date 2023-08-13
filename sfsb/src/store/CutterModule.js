import api from "@/api/instance";

export default {
  state: {
    cutters: [],
    cutter: {
      price: {}
    },
    cutterDialogVisible: false,
    cutterCreateDialogVisible: false,
    cutterDialogFromItem: true
  },
  mutations: {
    setCutters(state, payload) {
      state.cutters = payload;
    },
    setCutter(state, payload) {
      state.cutter = payload;
    },
    setCutterDialogVisible(state, payload) {
      state.cutterDialogVisible = payload
    },
    setCutterCreateDialogVisible(state, payload) {
      state.cutterCreateDialogVisible = payload;
    },
    setCutterDialogFromItem(state, payload) {
      state.cutterDialogFromItem = payload;
    },
    saveCutterToCutters(state, payload) {
      const index = state.cutters.findIndex((cutter) => cutter.id === payload.id);
      if (index !== -1) {
        state.cutters.splice(index, 1, payload);
      } else {
        state.cutters.push(payload);
      }
    },
  },
  getters: {
    getCutters: (state) => state.cutters,
    getCutter: (state) => state.cutter,
    isCutterCreateDialogVisible: (state) => state.cutterCreateDialogVisible,
    isCutterDialogVisible: (state) => state.cutterDialogVisible,
    isCutterDialogFromItem: (state) => state.cutterDialogFromItem,
  },
  actions: {
    async fetchCutters({commit}) {
      try {
        const response = await api.get('/cutter');
        commit("setCutters", response.data);
      } catch (error) {
        console.log("Инструменты не найдены");
        console.error(error);
      }
    },
    async saveCutter({commit}, cutter) {
      try {
        const url = cutter.id
          ? `/cutter/${cutter.id}`
          : '/cutter';

        const response = await (cutter.id ? api.put(url, cutter) : api.post(url, cutter));
        commit("setCutter", response.data)
        commit("saveCutterToCutters", response.data);
        commit("setMapItem", {cutterTool: response.data});
      } catch (error) {
        console.log("Инструмент не создан");
        console.error(error);
      }
    },
  },
}
