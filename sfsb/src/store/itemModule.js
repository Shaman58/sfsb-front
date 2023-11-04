import api from "@/api/instance";
import {useToast} from "vue-toast-notification";

const toast = useToast();
export default {
  state: {
    items: [],
    item: {
      technology: {
        outsourcedCosts: {amount: 0, currency: 'RUB'}
      },
      customerMaterial: false,
    },
  },
  mutations: {
    setItem(state, payload) {
      state.item = payload
    },
    setItems(state, payload) {
      state.items = payload
    },
    saveItem(state, payload) {
      const index = state.items.findIndex(item => item.id === payload.id);
      if (index !== -1) {
        state.items.splice(index, 1, payload);
      } else {
        state.items.push(payload)
      }
    },
    deleteItem(state, payload) {
      state.items = state.items.filter(item => item.id !== payload.id);
    },
  },
  getters: {
    getItem: (state) => state.item,
    getItems: (state) => state.items,
  },
  actions: {
    fetchItems({commit}) {
      return api.get('/item')
        .then(response => commit("setItems", response.data))
        .catch(error => {
          console.log('Позиции не найдены');
          console.error(error);
        });
    },
    fetchItem({commit}, id) {
      return api.get(`/item/${id}`)
        .then(response => commit("setItem", response.data))
        .catch(error => {
          console.log('Позиция не найдена');
          console.error(error);
        });
    },
    async calculateItem({commit}, id) {
      await api.get("/doc/calculate", {
        params: {itemId: id},
      })
        .then(async () => {
          toast.info("Успешно расчитано!", {position: "top-right"});
        })
        .catch(error => {
          toast.error(error.response.data.info, {position: "top-right"});
        });
    },
  }
}
