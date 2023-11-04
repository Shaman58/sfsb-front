import api from "@/api/instance";
import {useToast} from "vue-toast-notification";

const toast = useToast();

export default {
  state: {
    employees: [],
  },
  mutations: {
    setEmployees(state, payload) {
      state.employees = payload
    },
    saveEmployee(state, payload) {
      const index = state.employees.findIndex(item => item.id === payload.id);
      if (index !== -1) {
        state.employees.splice(index, 1, payload);
      } else {
        state.employees.push(payload)
      }
    },
    deleteEmployee(state, payload) {
      state.employees = state.employees.filter(item => item.id !== payload.id);
    },
  },
  getters: {
    getEmployees: (state) => state.employees,
  },
  actions: {
    async fetchEmployees({commit}) {
      try {
        const url = `/employee`
        await api.get(url)
          .then(response => commit("setEmployees", response.data));
      } catch (error) {
        console.error(error);
      }
    },
    async saveEmployee({commit}, employee) {
      try {
        const url = employee.id
          ? `/employee/${employee.id}`
          : '/employee';

        const response = await (employee.id ? api.put(url, employee) : api.post(url, employee));
        commit("saveEmployee", response.data);
        toast.info("Успешно сохранено!", {position: "top-right"});
      } catch (error) {
        toast.error(error.response.data.info, {position: "top-right"});
        console.log("Сотрудник не создан");
        console.error(error);
      }
    },
    async deleteEmployee({commit}, employee) {
      try {
        await api.delete(`/employee/${employee.id}`);
        commit("deleteEmployee", employee);
        toast.info("Успешно удален!", {position: "top-right"});
      } catch (error) {
        toast.error(error.response.data.info, {position: "top-right"});
        console.log("Сотрудник не удален");
        console.error(error);
      }
    },
  }
}
