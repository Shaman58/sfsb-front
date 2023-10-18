import api from "@/api/instance";

export default {
  state: {
    orders: []
  },
  mutations: {
    setOrders(state, payload) {
      state.orders = payload
    },
    saveOrder(state, payload) {
      const index = state.orders.findIndex((order) => order.id === payload.id);
      if (index !== -1) {
        state.orders.splice(index, 1, payload);
      } else {
        state.orders.push(payload);
      }
    },
    deleteOrder(state, payload) {
      state.orders = state.orders.filter(order => order.id !== payload.id);
    },
  },
  getters: {
    getOrders: (state) => state.orders,
  },
  actions: {
    fetchOrders({commit}) {
      return api.get('/order')
        .then(response => commit("setOrders", response.data))
        .catch(error => {
          console.log('Заказы не найдены');
          console.error(error);
        });
    },
    async saveOrder({dispatch, commit}, order) {
      try {
        const url = order.id
          ? `/order/${order.id}`
          : '/order';
        const response = await (order.id
          ? api.put(url, order)
          : api.post(url, order));
        commit("saveOrder", response.data);
        return response.data;
      } catch (error) {
        console.log("Заявка не создана");
        console.error(error);
      }
    },
    async deleteOrder({commit}, order) {
      try {
        await api.delete(`/order/${order.id}`);
        commit("deleteOrder", order);
      } catch (error) {
        console.log('Заявка не удалена');
        console.error(error);
      }
    },
  }
}
