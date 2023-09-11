import api from "@/api/instance";

export default {
  state: {
    operations: [],
  },
  mutations: {
    setOperations(state, payload) {
      state.operations = payload;
    },
  },
  getters: {
    getOperations: (state) => state.operations,
  },
  actions: {
    async fetchOperations({commit}) {
      try {
        const response = await api.get('/operation');
        commit("setOperations", response.data);
      } catch (error) {
        console.log("Операции не найдены");
        console.error(error);
      }
    },
  },
}
