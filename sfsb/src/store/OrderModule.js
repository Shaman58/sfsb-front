import api from "@/api/instance";

export default {
  state: {
    orders: [],
    order: {},
    listDialog: false,
    createDialog: false,
  },
  mutations: {
    setOrders(state, payload) {
      state.orders = payload
    },
    setOrder(state, payload) {
      state.order = payload
    },
    setOrdersListDialog(state, payload) {
      state.listDialog = payload;
    },
    setOrderCreateDialog(state, payload) {
      state.createDialog = payload;
    },
    saveOrderToOrders(state, payload) {
      const index = state.orders.findIndex((order) => order.id === payload.id);
      if (index !== -1) {
        state.orders.splice(index, 1, payload);
      } else {
        state.orders.push(payload);
      }
    },
    deleteOrderFormOrders(state, payload) {
      state.orders = state.orders.filter(order => order.id !== payload.id);
    },
  },
  getters: {
    getOrders: (state) => state.orders,
    getOrder: (state) => state.order,
    isOrderDialogVisible: (state) => state.listDialog,
    isOrderCreateDialogVisible: (state) => state.createDialog,
  },
  actions: {
    async fetchAllOrdersData({dispatch, state}) {
      try {
        await dispatch("fetchOrdersData");
        const orders = state.orders;
        const promises = orders.map(order => dispatch('fetchItemsByOrderId', order));
        await Promise.all(promises);
      } catch (error) {
        console.error(error);
      }
    },
    fetchOrdersData({commit}) {
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
        const response = await (order.id ? api.put(url, order) : api.post(url, order));
        dispatch("fetchItemsByOrderId", response.data)
      } catch (error) {
        console.log("Заявка не создана");
        console.error(error);
      }
    },
    async deleteOrder({commit}, order) {
      try {
        await api.delete(`/order/${order.id}`);
        commit("deleteOrderFormOrders", order);
      } catch (error) {
        console.log('Заявка не удалена');
        console.error(error);
      }
    },
  }
}
