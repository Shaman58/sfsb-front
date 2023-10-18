import api from "@/api/instance";

export default {
  state: {
    departments: [],
  },
  mutations: {
    setDepartments(state, payload) {
      state.departments = payload
    },
  },
  getters: {
    getDepartments: (state) => state.departments,
  },
  actions: {
    fetchDepartments({commit}) {
      return api.get('/department')
        .then(response => commit("setDepartments", response.data))
        .catch(error => {
          console.log('Отделы не найдены');
          console.error(error);
        });
    },
  }
}
