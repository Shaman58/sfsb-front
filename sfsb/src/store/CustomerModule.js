import api from '../api/instance'

export default {
  state: {
    customers: [],
    customer: {},
    customerDialog: false,
    customerCreateDialog: false,
  },
  mutations: {
    setCustomers(state, payload) {
      state.customers = payload
    },
    setCustomer(state, payload) {
      state.customer = payload
    },
    setCustomerDialog(state, payload) {
      state.customerDialog = payload;
    },
    setCustomerCreateDialog(state, payload) {
      state.customerCreateDialog = payload;
    },
    saveCustomerToCustomers(state, payload) {
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
    changeCustomer(state, payload) {
      const index = state.customers.findIndex(customer => customer.id === payload.id);
      if (index !== -1) {
        state.customers.splice(index, 1, payload);
      }
    },
  },
  getters: {
    getCustomers: (state) => state.customers,
    getCustomer: (state) => state.customer,
    isCustomerDialogVisible: (state) => state.customerDialog,
    isCustomerCreateDialogVisible: (state) => state.customerCreateDialog,
  },
  actions: {
    async fetchCustomersData({dispatch, state}) {
      try {
        await dispatch("fetchCustomers");
        const customers = state.customers;
        const promises = customers.map(customer => dispatch('fetchContactsByCustomerId', customer));
        await Promise.all(promises);
      } catch (error) {
        console.error(error);
      }
    },
    fetchCustomers({commit}) {
      return api.get('/customer')
        .then(response => commit("setCustomers", response.data))
        .catch(error => {
          if (error.response && error.response.status === 404) {
            console.log('Заказчики не найдены');
          }
        });
    },
    async saveCustomer({commit}, customer) {
      try {
        const url = customer.id !== undefined ? `/customer/${customer.id}` : '/customer';
        const response = customer.id !== undefined ? await api.put(url, customer) : await api.post(url, customer);
        commit('saveCustomerToCustomers', response.data);
      } catch (error) {
        console.error(error);
      }
    },
    async deleteCustomer({commit}, customer) {
      try {
        await api.delete(`/customer/${customer.id}`);
        commit('deleteCustomer', customer);
      } catch (error) {
        console.log('Контакты не удален');
        console.error(error);
      }
    },
  }
}
