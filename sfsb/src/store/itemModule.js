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
    async saveItem({dispatch}, item) {
      try {
        const url = !!item.id
          ? `/item/${item.id}`
          : '/item';
        await (!!item.id ? api.put(url, item) : api.post(url, item));
        dispatch("fetchItemsByOrderId", item.order)
      } catch (error) {
        console.log("Позиция не создана");
        console.error(error);
      }
    },
    fetchItemsByOrderId({commit}, order) {
      return api.get(`/item/order/${order.id}`)
        .then(response => {
          const updatedOrder = {...order, items: response.data};
          commit("saveOrderToOrders", updatedOrder);
          commit("setOrder", updatedOrder);
        })
        .catch(error => {
          console.log('Позиции не найдены');
          console.error(error);
        });
    },
    async deleteItem({dispatch}, item) {
      try {
        await api.delete(`/item/${item.id}`);
        dispatch("fetchItemsByOrderId", item.order);
      } catch (error) {
        console.log('Позиция не удалена');
        console.error(error);
      }
    },
  }
}
