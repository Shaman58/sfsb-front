import api from "@/api/instance";

export default {
  state: {
    operations: [],
    operation: {},
  },
  mutations: {
    setOperations(state, payload) {
      state.operations = payload;
    },
    setOperation(state, payload) {
      state.operation = payload;
    },
  },
  getters: {
    getOperations: (state) => state.operations,
    getOperation: (state) => state.operation,
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
