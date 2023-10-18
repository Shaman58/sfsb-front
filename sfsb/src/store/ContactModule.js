import api from "@/api/instance";

export default {
  actions: {
    async saveContact({dispatch, commit}, contact) {
      try {
        const url = !!contact.id ? `/contact/${contact.id}` : '/contact';
        !!contact.id ? await api.put(url, contact) : await api.post(url, contact);
      } catch (error) {
        console.error(error);
      }
    },
    async deleteContact({dispatch}, contact) {
      try {
        await api.delete(`/contact/${contact.id}`);
      } catch (error) {
        console.log('Контакты не удален');
        console.error(error);
      }
    },
  }
}
