import api from "@/api/instance";

export default {
  state: {
    toolings: [],
    tooling: {
      price: {}
    },
    toolingDialogVisible: false,
    toolingCreateDialogVisible: false,
    toolingDialogFromItem: true
  },
  mutations: {
    setToolings(state, payload) {
      state.toolings = payload;
    },
    setTooling(state, payload) {
      state.tooling = payload;
    },
    setToolingDialogVisible(state, payload) {
      state.toolingDialogVisible = payload
    },
    setToolingCreateDialogVisible(state, payload) {
      state.toolingCreateDialogVisible = payload;
    },
    setToolingDialogFromItem(state, payload) {
      state.toolingDialogFromItem = payload;
    },
    saveToolingToToolings(state, payload) {
      const index = state.toolings.findIndex((tooling) => tooling.id === payload.id);
      if (index !== -1) {
        state.toolings.splice(index, 1, payload);
      } else {
        state.toolings.push(payload);
      }
    },
  },
  getters: {
    getToolings: (state) => state.toolings,
    getTooling: (state) => state.tooling,
    isToolingCreateDialogVisible: (state) => state.toolingCreateDialogVisible,
    isToolingDialogVisible: (state) => state.toolingDialogVisible,
    isToolingDialogFromItem: (state) => state.toolingDialogFromItem,
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
        commit("setTooling", response.data)
        commit("saveToolingToToolings", response.data);
        commit("setMapItem", {tooling: response.data});
      } catch (error) {
        console.log("Оснастка не создана");
        console.error(error);
      }
    },
  },
}
