import api from '../api/instance'
import {useToast} from "vue-toast-notification";

const toast = useToast();
export default {
  state: {
    company: {},
  },
  mutations: {
    setCompany(state, payload) {
      state.company = payload
    },
  },
  getters: {
    getCompany: (state) => state.company,
  },
  actions: {
    async fetchCompanyData({commit}) {
      try {
        await api.get('/company')
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
        const url = '/company';
        const response = await api.put(url, company);
        commit('setCompany', response.data);
        toast.info("Успешно сохранено!", {position: "top-right"});
      } catch (error) {
        toast.error(error.response.data.info, {position: "top-right"});
        console.error(error);
      }
    }
  }
}
