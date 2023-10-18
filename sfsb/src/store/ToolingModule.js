import api from "@/api/instance";

export default {
  state: {
    toolings: [],
  },
  mutations: {
    setToolings(state, payload) {
      state.toolings = payload;
    },
    saveTooling(state, payload) {
      const index = state.toolings.findIndex((tooling) => tooling.id === payload.id);
      if (index !== -1) {
        state.toolings.splice(index, 1, payload);
      } else {
        state.toolings.push(payload);
      }
    },
    deleteTooling(state, payload) {
      state.toolings = state.toolings.filter(tooling => tooling.id !== payload.id);
    },
  },
  getters: {
    getToolings: (state) => state.toolings,
  },
  actions: {
    async fetchToolings({commit}) {
      try {
        const response = await api.get('/tooling');
        commit("setToolings", response.data);
      } catch (error) {
        console.log("Оснастка не найдена");
        console.error(error);
      }
    },
    async saveTooling({commit}, tooling) {
      try {
        const url = tooling.id
          ? `/tooling/${tooling.id}`
          : '/tooling';

        const response = await (tooling.id ? api.put(url, tooling) : api.post(url, tooling));
        commit("saveTooling", response.data);
      } catch (error) {
        console.log("Оснастка не создана");
        console.error(error);
      }
    },
    async deleteTooling({commit}, tooling) {
      try {
        await api.delete(`/tooling/${tooling.id}`);
        commit("deleteTooling", tooling);
      } catch (error) {
        console.log("Оснастка не удалена");
        console.error(error);
      }
    },
  },
}
