import api from "@/api/instance";
import {useToast} from "vue-toast-notification";

const toast = useToast();

export default {
  state: {
    materials: [],
    materialTemplates: [],
  },
  mutations: {
    setMaterials(state, payload) {
      state.materials = payload;
    },
    setMaterialTemplates(state, payload) {
      state.materialTemplates = payload;
    },
    deleteMaterial(state, payload) {
      state.materials = state.materials.filter(material => material.id !== payload.id);
    },
    saveMaterial(state, payload) {
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
    getMaterialTemplates: (state) => state.materialTemplates,
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
    async fetchMaterialTemplates({commit}) {
      try {
        const response = await api.get('/material-density-template');
        commit("setMaterialTemplates", response.data);
      } catch (error) {
        console.log("Шаблоны материалов не найдены");
        console.error(error);
      }
    },
    async saveMaterial({commit}, material) {
      try {
        const url = material.id
          ? `/material/${material.id}`
          : '/material';

        const response = await (material.id ? api.put(url, material) : api.post(url, material));
        commit("saveMaterial", response.data);
        toast.info("Успешно сохранено!", {position: "top-right"});
      } catch (error) {
        toast.error(error.response.data.info, {position: "top-right"});
        console.log("Материал не создан");
        console.error(error);
      }
    },
    async deleteMaterial({commit}, material) {
      try {
        await api.delete(`/material/${material.id}`)
        commit("deleteMaterial", material);
        toast.info("Успешно удален!", {position: "top-right"});
      } catch (error) {
        toast.error(error.response.data.info, {position: "top-right"});
        console.log("Материал не удален");
        console.error(error);
      }
    },
  },
}
