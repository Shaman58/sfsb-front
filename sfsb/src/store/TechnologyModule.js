import api from "@/api/instance";

export default {
  state: {
    technology: {},
    technologies: [],
    dialogVisible: false,
  },
  mutations: {
    setTechnology(state, payload) {
      state.technology = payload
    },
    setTechnologies(state, payload) {
      state.technologies = payload
    },
    setTechnologyDialogVisible(state, payload) {
      state.dialogVisible = payload
    },
    saveTechnology(state, payload) {
      const index = state.technologies.findIndex(technology => technology.id === payload.id);
      if (index !== -1) {
        state.technologies.splice(index, 1, payload);
      } else {
        state.technologies.push(payload)
      }
    },
  },
  getters: {
    getTechnology: (state) => state.technology,
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
    fetchTechnologyById({dispatch}, id) {
      return api.get(`/technology/${id}`)
        .then(response => {
          dispatch('fetchSetupsByTechnologyId', response.data);
        })
        .catch(error => {
          console.log('Технология не найдена');
          console.error(error);
        });
    },
    async saveTechnology({dispatch}, technology) {
      try {
        const url = `/technology/${technology.id}`;
        const response = await api.put(url, technology);
        return response.data;
      } catch (error) {
        console.log("Заготовка не создана");
        console.error(error);
      }
    },
  },
}
