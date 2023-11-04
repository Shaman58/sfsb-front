import api from "@/api/instance";
import {useToast} from "vue-toast-notification";

const toast = useToast();
export default {
  actions: {
    async saveContact({dispatch, commit}, contact) {
      try {
        const url = !!contact.id ? `/contact/${contact.id}` : '/contact';
        !!contact.id ? await api.put(url, contact) : await api.post(url, contact);
        toast.info("Успешно сохранено!", {position: "top-right"});
      } catch (error) {
        toast.error(error.response.data.info, {position: "top-right"});
        console.error(error);
      }
    },
    async deleteContact({dispatch}, contact) {
      try {
        await api.delete(`/contact/${contact.id}`);
        toast.info("Успешно удален!", {position: "top-right"});
      } catch (error) {
        toast.error(error.response.data.info, {position: "top-right"});
        console.log('Контакты не удален');
        console.error(error);
      }
    },
  }
}
