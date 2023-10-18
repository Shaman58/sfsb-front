import api from '../api/instance'

export default {
  state: {
    customers: [],
  },
  mutations: {
    setCustomers(state, payload) {
      state.customers = payload
    },
    saveCustomer(state, payload) {
      const index = state.customers.findIndex((customer) => customer.id === payload.id);
      if (index !== -1) {
        state.customers.splice(index, 1, payload);
      } else {
        state.customers.push(payload);
      }
    },
    deleteCustomer(state, payload) {
      state.customers = state.customers.filter(customer => customer.id !== payload.id)
    },
  },
  getters: {
    getCustomers: (state) => state.customers,
  },
  actions: {
    async fetchCustomers({commit}) {
      api.get('/customer')
        .then(response =>
          commit("setCustomers", response.data))
        .catch(error => {
          console.log("Инструмент не найден");
          console.error(error);
        });
    },
    async saveCustomer({commit}, customer) {
      try {
        const url = customer.id
          ? `/customer/${customer.id}`
          : '/customer';

        const response = customer.id
          ? await api.put(url, customer)
          : await api.post(url, customer);
        commit('saveCustomer', response.data);
      } catch (error) {
        console.log("Контрагент не создан");
        console.error(error);
      }
    },
    async deleteCustomer({commit}, customer) {
      try {
        await api.delete(`/customer/${customer.id}`);
        commit('deleteCustomer', customer);
      } catch (error) {
        console.log('Контрагент не удален');
        console.error(error);
      }
    },
  }
}
