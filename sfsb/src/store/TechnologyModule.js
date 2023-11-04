import api from "@/api/instance";
import {useToast} from "vue-toast-notification";

const toast = useToast();

export default {
  state: {
    dialogVisible: false,
  },
  mutations: {
    setTechnologyDialogVisible(state, payload) {
      state.dialogVisible = payload
    },
  },
  getters: {
    isTechnologyDialogVisible: (state) => state.dialogVisible,
  },
  actions: {
    async saveTechnology({dispatch}, technology) {
      try {
        const url = `/technology/${technology.id}`;
        await api.put(url, technology);
        toast.info("Успешно сохранено!", {position: "top-right"});
      } catch (error) {
        toast.error(error.response.data.info, {position: "top-right"});
        console.log("Технология не создана");
        console.error(error);
      }
    },
  },
}
