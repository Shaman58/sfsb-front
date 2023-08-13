import api from "@/api/instance";

export default {
  state: {
    listDialog: false,
  },
  mutations: {
    setContactListDialogVisible(state, payload) {
      state.listDialog = payload;
    },
  },
  getters: {
    isListDialogVisible: (state) => state.listDialog,
  },
  actions: {
    async saveContact({dispatch}, contact) {
      try {
        const url = !!contact.id ? `/contact/${contact.id}` : '/contact';
        const response = !!contact.id ? await api.put(url, contact) : await api.post(url, contact);
        dispatch('fetchContactsByCustomerId', response.data.customer);
      } catch (error) {
        console.error(error);
      }
    },
    fetchContactsByCustomerId({commit}, customer) {
      return api.get(`/contact/customer/${customer.id}`)
        .then(response => {
          const updatedCustomer = {...customer, contacts: response.data};
          commit("changeCustomer", updatedCustomer);
          commit("setSelectedCompany", updatedCustomer);
        })
        .catch(error => {
          console.log('Контакты не найдены');
          console.error(error);
        });
    },
    async deleteContact({dispatch}, contact) {
      try {
        await api.delete(`/contact/${contact.id}`);
        dispatch('fetchContactsByCustomerId', contact.customer);
      } catch (error) {
        console.log('Контакты не удален');
        console.error(error);
      }
    },
  }
}
