import api from "@/api/instance";

export default {
  state: {
    specials: [],
    special: {
      price: {}
    },
    specialDialogVisible: false,
    specialCreateDialogVisible: false,
    specialDialogFromItem: true
  },
  mutations: {
    setSpecials(state, payload) {
      state.specials = payload;
    },
    setSpecial(state, payload) {
      state.special = payload;
    },
    setSpecialDialogVisible(state, payload) {
      state.specialDialogVisible = payload
    },
    setSpecialCreateDialogVisible(state, payload) {
      state.specialCreateDialogVisible = payload;
    },
    setSpecialDialogFromItem(state, payload) {
      state.specialDialogFromItem = payload;
    },
    saveSpecialToSpecials(state, payload) {
      const index = state.specials.findIndex((special) => special.id === payload.id);
      if (index !== -1) {
        state.specials.splice(index, 1, payload);
      } else {
        state.specials.push(payload);
      }
    },
  },
  getters: {
    getSpecials: (state) => state.specials,
    getSpecial: (state) => state.special,
    isSpecialCreateDialogVisible: (state) => state.specialCreateDialogVisible,
    isSpecialDialogVisible: (state) => state.specialDialogVisible,
    isSpecialDialogFromItem: (state) => state.specialDialogFromItem,
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
        commit("setSpecial", response.data)
        commit("saveSpecialToSpecials", response.data);
        commit("setMapItem", {specialTool: response.data});
        return response.data;
      } catch (error) {
        console.log("Специнструмент не создан");
        console.error(error);
      }
    },
  },
}
