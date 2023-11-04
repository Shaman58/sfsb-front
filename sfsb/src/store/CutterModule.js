import api from "@/api/instance";
import {useToast} from "vue-toast-notification";

const toast = useToast();

export default {
  state: {
    cutters: [],
  },
  mutations: {
    setCutters(state, payload) {
      state.cutters = payload;
    },
    saveCutter(state, payload) {
      const index = state.cutters.findIndex(item => item.id === payload.id);
      if (index !== -1) {
        state.cutters.splice(index, 1, payload);
      } else {
        state.cutters.push(payload)
      }
    },
    deleteCutter(state, payload) {
      state.cutters = state.cutters.filter(item => item.id !== payload.id);
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

        const response = await (cutter.id
          ? api.put(url, cutter)
          : api.post(url, cutter));
        commit("saveCutter", response.data);
        toast.info("Успешно сохранено!", {position: "top-right"});
      } catch (error) {
        toast.error(error.response.data.info, {position: "top-right"});
        console.log("Инструмент не создан");
        console.error(error);
      }
    },
    async deleteCutter({commit}, cutter) {
      try {
        await api.delete(`/cutter/${cutter.id}`);
        commit("deleteCutter", cutter);
        toast.info("Успешно удален!", {position: "top-right"});
      } catch (error) {
        toast.error(error.response.data.info, {position: "top-right"});
        console.log("Инструмент не удален");
        console.error(error);
      }
    },
  },
}
