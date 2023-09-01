import api from "@/api/instance";
import store from "@/store/index";

export default {
  state: {
    setups: [],
  },
  mutations: {
    setSetups(state, payload) {
      state.setups = payload
    },
    addSetup(state, payload) {
      const index = state.setups.findIndex(setup => setup.id === payload.id);
      if (index !== -1) {
        state.setups.splice(index, 1, payload);
      } else {
        state.setups.push(payload)
      }
    },
  },
  getters: {
    getSetups: (state) => state.setups.slice().sort((a, b) => a.setupNumber - b.setupNumber)
  },
  actions: {
    fetchSetupsByTechnologyId({commit}, technology) {
      return api.get(`/setup/technology/${technology.id}`)
        .then(response => {
          const updatedTechnology = {...technology, setups: response.data};
          commit("saveTechnology", updatedTechnology);
          commit("setTechnology", updatedTechnology);
        })
        .catch(error => {
          console.log('Установки не найдены');
          console.error(error);
        });
    },
    fetchSetupsByItemId({commit}, item) {
      return api.get(`/setup/technology/${item.technology.id}`)
        .then(response => {
          const updatedItem = {...item, technology: {...item.technology, setups: response.data}};
          commit("saveItem", updatedItem);
          commit("setItem", updatedItem);
        })
        .catch(error => {
          console.log('Установки не найдены');
          console.error(error);
        });
    },
    async saveSetup({dispatch, commit}, setup) {
      try {
        const url = setup.id
          ? `/setup/${setup.id}`
          : '/setup';
        const response = await (setup.id ? api.put(url, setup) : api.post(url, setup));
        commit("addSetup", response.data);
      } catch (error) {
        console.log("Установка не создана");
        console.error(error);
      }
    },
    async deleteSetup({commit}, setup) {
      try {
        await api.delete(`/setup/${setup.id}`).then(() => {
          let setups = store.getters.getSetups;
          setups = setups.filter(item => item.id !== setup.id);
          commit("setSetups", setups);
        });
      } catch (error) {
        if (error.response && error.response.status === 404) {
          console.log('Установка не найдена');
        }
      }
    },
  },
}
