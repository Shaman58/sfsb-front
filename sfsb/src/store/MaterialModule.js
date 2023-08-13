import api from "@/api/instance";

export default {
  state: {
    materials: [],
    material: {},
    materialListVisible: false,
    materialDialogVisible: false,
  },
  mutations: {
    setMaterials(state, payload) {
      state.materials = payload;
    },
    setMaterial(state, payload) {
      state.material = payload;
    },
    setMaterialListVisible(state, payload) {
      state.materialListVisible = payload;
    },
    deleteMaterial(state, payload) {
      state.materials = state.materials.filter(material => material.id !== payload.id);
    },
    setMaterialDialogVisible(state, payload) {
      state.materialDialogVisible = payload;
    },
    saveMaterialToMaterials(state, payload) {
      const index = state.materials.findIndex((material) => material.id === payload.id);
      if (index !== -1) {
        state.materials.splice(index, 1, payload);
      } else {
        state.materials.push(payload);
      }
    },
  },
  getters: {
    getMaterials: (state) => state.materials,
    getMaterial: (state) => state.material,
    getMaterialListVisible: (state) => state.materialListVisible,
    getMaterialDialogVisible: (state) => state.materialDialogVisible,
  },
  actions: {
    async fetchMaterials({commit}) {
      try {
        const response = await api.get('/material');
        commit("setMaterials", response.data);
      } catch (error) {
        console.log("Материалы не найдены");
        console.error(error);
      }
    },
    async deleteMaterial({commit}, material) {
      try {
        await api.delete(`/material/${material.id}`)
        commit("deleteMaterial", material)
      } catch (error) {
        console.log("Материал не удален");
        console.error(error);
      }
    },
    async saveMaterial({commit}, material) {
      try {
        const url = material.id
          ? `/material/${material.id}`
          : '/material';

        const response = await (material.id ? api.put(url, material) : api.post(url, material));
        commit("setMaterial", response.data)
        commit("saveMaterialToMaterials", response.data);
      } catch (error) {
        console.log("Материал не создан");
        console.error(error);
      }
    },
  },
}
