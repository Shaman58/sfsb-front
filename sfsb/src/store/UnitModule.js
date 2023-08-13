import store from "@/store/index";
import api from "@/api/instance";

export default {
  state: {
    units: [],
    selectedUnit: {},
    unitCreateDialog: false,
  },
  mutations: {
    setUnitCreateDialog(state, payload) {
      state.unitCreateDialog = payload;
    },
    setSelectedUnit(state, payload) {
      state.selectedUnit = payload;
    },
    setUnits(state, payload) {
      state.units = payload;
    },
  },
  getters: {
    isUnitDialogVisible: (state) => state.unitCreateDialog,
    getSelectedUnit: (state) => state.selectedUnit,
    getUnits: (state) => state.units,
  },
  actions: {
    fetchUnitsByAreaId({commit}, area) {
      return api.get(`/unit/area/${area.id}`)
        .then(response => {
          const updatedArea = {...area, units: response.data};
          commit("saveArea", updatedArea);
          commit("setArea", updatedArea);
        })
        .catch(error => {
          console.log('Оборудование не найдено');
          console.error(error);
        });
    },
    fetchAllUnits({commit}) {
      return api.get(`/unit`)
        .then(response => {
          commit("setUnits", response.data);
        })
        .catch(error => {
          console.log('Оборудование не найдено');
          console.error(error);
        });
    },
    async deleteUnit({commit}, unit) {
      try {
        await api.delete(`/unit/${unit.id}`).then(
          commit("deleteUnit", unit))
      } catch (error) {
        if (error.response && error.response.status === 404) {
          console.log('Оборудование не найдено');
        }
      }
    },
    async saveUnit({commit}, unit) {
      try {
        const currentArea = store.getters.getSelectedArea;
        if (unit.id !== undefined) {
          const url = `/unit/${unit.id}/area/${currentArea.id}`;
          const response = await api.put(url, unit);
          const savedUnit = response.data;
          commit("saveUnit", savedUnit);
        } else {
          const url = `/unit/area/${currentArea.id}`;
          const response = await api.post(url, {
            unitName: unit.unitName,
            price: {
              amount: unit.price.amount,
              currency: 'RUB'
            },
            paymentPerHour: {
              amount: unit.paymentPerHour.amount,
              currency: 'RUB'
            },
            unitNumber: unit.unitNumber
          });
          const savedUnit = response.data;
          savedUnit.units = [];
          commit("saveUnit", savedUnit);
          commit("setSelectedUnit", savedUnit)
        }
      } catch (error) {
        console.error(error);
      }
    },
  }
}
