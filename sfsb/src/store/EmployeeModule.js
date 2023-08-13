import api from "@/api/instance";

export default {
  state: {
    employees: [],
    employee: {},
    employeeDialog: false,
  },
  mutations: {
    setEmployees(state, payload) {
      state.employees = payload
    },
    setEmployeeDialog(state, payload) {
      state.employeeDialog = payload
    },
    setEmployee(state, payload) {
      state.employee = payload
    },
  },
  getters: {
    getEmployees: (state) => state.employees,
    getEmployee: (state) => state.employee,
    getEmployeeDialogVisible: (state) => state.employeeDialog,
  },
  actions: {
    async saveEmployee({commit}, employee) {
      if (employee.id !== undefined) {
        return api.put(`/employee/${employee.id}`, employee)
          .then(response => {
            if (employee.department !== null) {
              commit("changeEmployee", response.data)
            }
          })
          .catch(error => {
            console.error(error)
          })
      } else {
        return api.post(`/employee`, employee)
          .then(response => {
            commit("addEmployee", response.data)
          })
          .catch(error => {
            console.error(error)
          })
      }
    },
    async fetchEmployees({commit}) {
      try {
        const url = `/employee`
        await api.get(url)
          .then(response => commit("setEmployees", response.data));
      } catch (error) {
        console.error(error);
      }
    },
    fetchEmployeesByDepId({commit}, department) {
      return api.get(`/employee/department/${department.id}`)
        .then(response => {
          const updatedDepartment = {...department, employees: response.data};
          commit("changeDepartment", updatedDepartment);
        })
        .catch(error => {
          console.log('Отделы не найдены');
          console.error(error);
        });
    },
  }
}
