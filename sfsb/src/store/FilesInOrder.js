import api from "../api/instance";
import { useToast } from "vue-toast-notification";


const toast = useToast();
export default {
  state: {
    files: [],
    currentOrder: null,
  },
  mutations: {
    setAllFiles(state, data) {
      state.files = data;
    },
    setCurrenOrderTo(state,orderId){
      state.currentOrder = orderId
    }
  },
  getters: {
    getAllFiles: (state) => state.files,
  },
  actions: {
    async getAllFilesByOrder({ commit }, orderId) {
      try {
        const { data } = await api.get(`/file/order/${orderId}`);
        commit("setCurrenOrderTo", orderId);
        commit("setAllFiles", data);
      } catch (error) {
        toast.error("Ошибка получения данных:" + error.message);
      }
    },
    async addFile({ state, dispatch }, data) {
      try {
        if (state.currentOrder === undefined || state.currentOrder === null)
          return;
        const {status} = await api.post(
          `/file/order/${state.currentOrder}`,
          data,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );

        if (200 <= status < 300) return dispatch("getAllFilesByOrder", state.currentOrder); //статус успешен

        throw Error("send file is not ok");
      } catch (error) {
        toast.error("Ошибка передачи данных:" + error.message);
      }
    },

    async deleteFile({state,dispatch}, fileId){
      try {
        if (fileId === undefined || state.currentOrder === null)
          return;
        const { status } = await api.delete(`/file/${fileId}`);

        if (200 <= status < 300)
          return dispatch("getAllFilesByOrder", state.currentOrder); //статус успешен

        throw Error("delete file is not ok");
      } catch (error) {
        toast.error("Ошибка удаления данных:" + error.message);
      }
    }
  },
};
