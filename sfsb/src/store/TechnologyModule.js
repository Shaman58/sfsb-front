import api from "@/api/instance";

export default {
  state: {
    technologies: [],
    dialogVisible: false,
  },
  mutations: {
    setTechnologies(state, payload) {
      state.technologies = payload
    },
    setTechnologyDialogVisible(state, payload) {
      state.dialogVisible = payload
    },
  },
  getters: {
    getTechnologies: (state) => state.technologies,
    isTechnologyDialogVisible: (state) => state.dialogVisible,
  },
  actions: {
    fetchTechnologies({commit}) {
      return api.get('/technology')
        .then(response => commit("setTechnologies", response.data))
        .catch(error => {
          console.log('Технологии не найдены');
          console.error(error);
        });
    },
    async saveTechnology({dispatch}, technology) {
      try {
        const url = `/technology/${technology.id}`;
        const response = await api.put(url, technology);
        return response.data;
      } catch (error) {
        console.log("Технология не создана");
        console.error(error);
      }
    },
  },
}
