import api from "@/api/instance";

export default {
  state: {
    specials: [],
    special: {},
    specialListVisible: false,
    specialDialogVisible: false,
  },
  mutations: {
    setSpecials(state, payload) {
      state.specials = payload;
    },
    setSpecial(state, payload) {
      state.special = payload;
    },
    saveSpecial(state, payload) {
      const index = state.specials.findIndex(item => item.id === payload.id);
      if (index !== -1) {
        state.specials.splice(index, 1, payload);
      } else {
        state.specials.push(payload)
      }
    },
    setSpecialListVisible(state, payload) {
      state.specialListVisible = payload;
    },
    setSpecialDialogVisible(state, payload) {
      state.specialDialogVisible = payload;
    },
    deleteSpecial(state, payload) {
      state.specials = state.specials.filter(special => special.id !== payload.id);
    },
  },
  getters: {
    getSpecials: (state) => state.specials,
    getSpecial: (state) => state.special,
    getSpecialListVisible: (state) => state.specialListVisible,
    getSpecialDialogVisible: (state) => state.specialDialogVisible,
  },
  actions: {
    async fetchSpecials({commit}) {
      try {
        const response = await api.get('/special');
        commit("setSpecials", response.data);
      } catch (error) {
        console.log("Специнструмент не найден");
        console.error(error);
      }
    },
    async saveSpecial({commit}, special) {
      try {
        const url = special.id
          ? `/special/${special.id}`
          : '/special';

        const response = await (special.id ? api.put(url, special) : api.post(url, special));
        commit("saveSpecial", response.data);
        return response.data;
      } catch (error) {
        console.log("Специнструмент не создан");
        console.error(error);
      }
    },
    async deleteSpecial({commit}, special) {
      try {
        await api.delete(`/special/${special.id}`);
        commit("deleteSpecial", special);
      } catch (error) {
        console.log("Специнструмент не удален");
        console.error(error);
      }
    },
  },
}
