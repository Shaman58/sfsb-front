import api from "@/api/instance";

export default {
  state: {
    cutters: [],
  },
  mutations: {
    setCutters(state, payload) {
      state.cutters = payload;
    },
  },
  getters: {
    getCutters: (state) => state.cutters,
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
        return response.data;
      } catch (error) {
        console.log("Инструмент не создан");
        console.error(error);
      }
    },
  },
}
