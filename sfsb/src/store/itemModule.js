import api from "@/api/instance";

export default {
  state: {
    items: [],
    item: {
      technology: {},
      customerMaterial: false,
    },
  },
  mutations: {
    setItem(state, payload) {
      state.item = payload
    },
    setItems(state, payload) {
      state.items = payload
    },
    saveItem(state, payload) {
      const index = state.items.findIndex(item => item.id === payload.id);
      if (index !== -1) {
        state.items.splice(index, 1, payload);
      } else {
        state.items.push(payload)
      }
    },
    deleteItem(state, payload) {
      state.items = state.items.filter(item => item.id !== payload.id);
    },
  },
  getters: {
    getItem: (state) => state.item,
    getItems: (state) => state.items,
  },
  actions: {
    fetchItems({commit}) {
      return api.get('/item')
        .then(response => commit("setItems", response.data))
        .catch(error => {
          console.log('Позиции не найдены');
          console.error(error);
        });
    },
    fetchItem({commit}, id) {
      return api.get(`/item/${id}`)
        .then(response => commit("setItem", response.data))
        .catch(error => {
          console.log('Позиция не найдена');
          console.error(error);
        });
    },
    async saveItem({commit}, item) {
      try {
        const url = !!item.id
          ? `/item/${item.id}`
          : '/item';
        await (!!item.id ? api.put(url, item) : api.post(url, item))
          .then(response => commit("saveItem", response.data));
      } catch (error) {
        console.log("Позиция не создана");
        console.error(error);
      }
    },
    async deleteItem({commit}, item) {
      try {
        await api.delete(`/item/${item.id}`);
        commit("deleteItem", item);
      } catch (error) {
        console.log('Позиция не удалена');
        console.error(error);
      }
    },
  }
}
