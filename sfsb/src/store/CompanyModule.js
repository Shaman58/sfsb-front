import api from '../api/instance'

export default {
  state: {
    company: {},
    selectedCompany: {},
    companyDialog: false,
  },
  mutations: {
    setCompany(state, payload) {
      state.company = payload
    },
    setSelectedCompany(state, payload) {
      state.selectedCompany = payload
    },
    setCompanyDialog(state, payload) {
      state.companyDialog = payload;
    },
  },
  getters: {
    getCompany: (state) => state.company,
    getSelectedCompany: (state) => state.selectedCompany,
    isCompanyDialogVisible: (state) => state.companyDialog,
  },
  actions: {
    async fetchCompanyData({commit}) {
      try {
        await api.get('/company/1')
          .then(response => commit("setCompany", response.data))
      } catch (error) {
        if (error.response && error.response.status === 404) {
          commit("setCompany", {director: null});
          console.log('Компания не найдена');
        }
      }
    },
    async saveCompany({commit}, company) {
      try {
        const url = !!company.id ? `/company/${company.id}` : '/company';
        const response = !!company.id ? await api.put(url, company) : await api.post(url, company);
        commit('setCompany', response.data);
      } catch (error) {
        console.error(error);
      }
    }
  }
}
