import api from "@/api/instance";

export default {
  state: {
    measurers: [],
    measure: {
      price: {}
    },
    measureDialogVisible: false,
    measureCreateDialogVisible: false,
    measureDialogFromItem: true
  },
  mutations: {
    setMeasurers(state, payload) {
      state.measurers = payload;
    },
    setMeasure(state, payload) {
      state.measure = payload;
    },
    setMeasureDialogVisible(state, payload) {
      state.measureDialogVisible = payload
    },
    setMeasureCreateDialogVisible(state, payload) {
      state.measureCreateDialogVisible = payload;
    },
    setMeasureDialogFromItem(state, payload) {
      state.measureDialogFromItem = payload;
    },
    saveMeasureToMeasurers(state, payload) {
      const index = state.measurers.findIndex((measure) => measure.id === payload.id);
      if (index !== -1) {
        state.measurers.splice(index, 1, payload);
      } else {
        state.measurers.push(payload);
      }
    },
  },
  getters: {
    getMeasurers: (state) => state.measurers,
    getMeasure: (state) => state.measure,
    isMeasureCreateDialogVisible: (state) => state.measureCreateDialogVisible,
    isMeasureDialogVisible: (state) => state.measureDialogVisible,
    isMeasureDialogFromItem: (state) => state.measureDialogFromItem,
  },
  actions: {
    async fetchMeasurers({commit}) {
      try {
        const response = await api.get('/measure');
        commit("setMeasurers", response.data);
      } catch (error) {
        console.log("Меритель не найден");
        console.error(error);
      }
    },
    async saveMeasure({commit}, measure) {
      try {
        const url = measure.id
          ? `/measure/${measure.id}`
          : '/measure';

        const response = await (measure.id ? api.put(url, measure) : api.post(url, measure));
        commit("setMeasure", response.data)
        commit("saveMeasureToMeasurers", response.data);
        commit("setMapItem", {measureTool: response.data});
      } catch (error) {
        console.log("Меритель не создан");
        console.error(error);
      }
    },
  },
}
