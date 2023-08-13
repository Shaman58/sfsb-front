import api from "@/api/instance";

export default {
  state: {
    areas: [],
    area: {},
    areaDialog: false,
    areaCreateDialog: false,
    selectedAreaId: Number
  },
  mutations: {
    setAreas(state, payload) {
      state.areas = payload
    },
    setArea(state, payload) {
      state.area = payload
    },
    setAreaDialog(state, payload) {
      state.areaDialog = payload;
    },
    setCreateAreaDialog(state, payload) {
      state.areaCreateDialog = payload;
    },
    saveArea(state, payload) {
      const index = state.areas.findIndex(area => area.id === payload.id);
      if (index !== -1) {
        state.areas.splice(index, 1, payload);
      } else {
        state.areas.push(payload)
      }
    },
    deleteArea(state, payload) {
      state.area = state.areas.filter(area => area.id !== payload.id)
    },
    deleteUnit(state, payload) {
      const areaIndex = state.areas.findIndex(area => area.id === state.area.id);
      if (areaIndex !== -1) {
        const units = state.areas[areaIndex].units;
        const unitIndex = units.findIndex(unit => unit.id === payload.id);
        if (unitIndex !== -1) {
          units.splice(unitIndex, 1);
        }
      } else {
        console.error('No area with current id');
      }
    },
    saveUnit(state, payload) {
      const areaIndex = state.areas.findIndex(area => area.id === state.area.id);
      if (areaIndex !== -1) {
        const unitIndex = state.areas[areaIndex].units.findIndex(unit => unit.id === payload.id);
        if (unitIndex !== -1) {
          state.areas[areaIndex].units.splice(unitIndex, 1, payload);
        } else {
          state.areas[areaIndex].units.push(payload);
        }
      } else {
        console.error('No area with current id')
      }
    },
  },
  getters: {
    getAreas: (state) => state.areas,
    getSelectedArea: (state) => state.area,
    isAreaDialogVisible: (state) => state.areaDialog,
    isAreaCreateDialogVisible: (state) => state.areaCreateDialog,
  },
  actions: {
    async fetchAllAreaData({dispatch, state}) {
      try {
        await dispatch("fetchAreaData");
        const areas = state.areas;
        const promises = areas.map(area => dispatch('fetchUnitsByAreaId', area));
        await Promise.all(promises);
      } catch (error) {
        console.error(error);
      }
    },
    fetchAreaData({commit}) {
      return api.get('/area/company/1')
        .then(response => commit("setAreas", response.data))
        .catch(error => {
          console.log('Площадки не найдены');
          console.error(error);
        });
    },
    fetchAreaById({dispatch}, areaId) {
      return api.get(`/area/${areaId}`)
        .then(response => {
          dispatch('fetchUnitsByAreaId', response.data);
        })
        .catch(error => {
          console.log('Площадка не найдены');
          console.error(error);
        });
    },
    async saveArea({commit}, area) {
      try {
        if (area.id !== undefined) {
          const url = `/area/${area.id}`;
          const response = await api.put(url, area);
          const savedArea = response.data;
          savedArea.units = area.units;
          commit("saveArea", savedArea);
        } else {
          const url = `/area`;
          const response = await api.post(url, {
            areaName: area.areaName,
            company: {
              id: 1
            },
          });
          const savedArea = response.data;
          savedArea.units = [];
          commit("saveArea", savedArea);
          commit("setArea", savedArea);
        }
      } catch (error) {
        console.error(error);
      }
    },
  }
}
