import api from "@/api/instance";

export default {
  state: {
    setupPrice: {},
    techPrice: {},
    operation: {},
    operations: [],
    operationListVisible: false,
    operationDialogVisible: false,
  },
  mutations: {
    setSetupPrice(state, payload) {
      state.setupPrice = payload;
    },
    setTechPrice(state, payload) {
      state.techPrice = payload;
    },
    setOperation(state, payload) {
      state.operation = payload;
    },
    setOperations(state, payload) {
      state.operations = payload;
    },
    setOperationListVisible(state, payload) {
      state.operationListVisible = payload;
    },
    setOperationDialogVisible(state, payload) {
      state.operationDialogVisible = payload;
    },
    saveOperation(state, payload) {
      const index = state.operations.findIndex(item => item.id === payload.id);
      if (index !== -1) {
        state.operations.splice(index, 1, payload);
      } else {
        state.operations.push(payload)
      }
    },
    deleteOperation(state, payload) {
      state.operations = state.operations.filter(operation => operation.id !== payload.id);
    },
  },
  getters: {
    getSetupPrice: (state) => state.setupPrice,
    getTechPrice: (state) => state.techPrice,
    getOperation: (state) => state.operation,
    getOperations: (state) => state.operations,
    getOperationListVisible: (state) => state.operationListVisible,
    getOperationDialogVisible: (state) => state.operationDialogVisible,
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
    async fetchSetupPrice({commit}) {
      try {
        const response = await api.get('/operation/setup');
        commit("setSetupPrice", response.data);
      } catch (error) {
        console.log("Операция не найдена");
        console.error(error);
      }
    },
    async fetchTechPrice({commit}) {
      try {
        const response = await api.get('/operation/technology');
        commit("setTechPrice", response.data);
      } catch (error) {
        console.log("Операция не найдена");
        console.error(error);
      }
    },
    async saveTechPrice({commit}, operation) {
      try {
        const url = `/operation/technology`

        const response = await api.put(url, operation);
        commit("setTechPrice", response.data);
        return response.data;
      } catch (error) {
        console.log("Операция не сохранена");
        console.error(error);
      }
    },
    async saveSetupPrice({commit}, operation) {
      try {
        const url = `/operation/setup`;

        const response = await api.put(url, operation);
        commit("setSetupPrice", response.data);
        return response.data;
      } catch (error) {
        console.log("Операция не сохранена");
        console.error(error);
      }
    },
    async saveOperation({commit}, operation) {
      try {
        const url = operation.id
          ? `/operation/${operation.id}`
          : '/operation';

        const response = await (operation.id ? api.put(url, operation) : api.post(url, operation));
        commit("saveOperation", response.data);
        return response.data;
      } catch (error) {
        console.log("Операция не создана");
        console.error(error);
      }
    },
    async deleteOperation({commit}, operation) {
      try {
        await api.delete(`/operation/${operation.id}`);
        commit("deleteOperation", operation);
      } catch (error) {
        console.log("Операция не удалена");
        console.error(error);
      }
    },
  },
}
