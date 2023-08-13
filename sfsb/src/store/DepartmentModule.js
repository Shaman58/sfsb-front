import api from "@/api/instance";

export default {
  state: {
    departments: [],
    selectDepartment: {},
    mainDialog: false,
    createDialog: false
  },
  mutations: {
    setDepartments(state, payload) {
      state.departments = payload
    },
    addDepartment(state, payload) {
      state.departments.push(payload)
    },
    changeDepartment(state, payload) {
      const index = state.departments.findIndex(dep => dep.id === payload.id);
      if (index !== -1) {
        state.departments.splice(index, 1, payload);
      }
    },
    setMainDialog(state, payload) {
      state.mainDialog = payload;
    },
    setDepartmentCreateDialog(state, payload) {
      state.createDialog = payload;
    },
    setSelectDepartment(state, payload) {
      state.selectDepartment = payload;
    },
    deleteDepartment(state, payload) {
      state.departments = state.departments.filter(dep => dep.id !== payload.id)
    },
    addEmployee(state, payload) {
      state.selectDepartment.employees.push(payload)
    },
    changeEmployee(state, payload) {
      const index = state.selectDepartment.employees.findIndex(emp => emp.id === payload.id);
      if (index !== -1) {
        state.selectDepartment.employees.splice(index, 1, payload);
      }
    },
  },
  getters: {
    getDepartments: (state) => state.departments,
    getDemoDepartments: (state) => state.departments.slice(0, 3),
    getMainDialog: (state) => state.mainDialog,
    getCreateDialogVisible: (state) => state.createDialog,
    getSelectDepartment: (state) => state.selectDepartment
  },
  actions: {
    async fetchAllDepartmentData({dispatch, state}) {
      try {
        await dispatch('fetchDepartments');
        const departments = state.departments;
        const promises = departments.map(dep => dispatch('fetchEmployeesByDepId', dep));
        await Promise.all(promises);
      } catch (error) {
        console.error(error);
      }
    },
    fetchDepartments({commit}) {
      return api.get('/department/company/1')
        .then(response => commit("setDepartments", response.data))
        .catch(error => {
          console.log('Отделы не найдены');
          console.error(error);
        });
    },
    async deleteDepartment({commit}, department) {
      try {
        await api.delete(`/department/${department.id}`);
        commit("deleteDepartment", department);
      } catch (error) {
        if (error.response && error.response.status === 404) {
          console.log('Отдел не найден');
        }
      }
    },
    async saveDepartment({commit}, department) {
      try {
        if (department.id !== undefined) {
          const url = `/department/${department.id}`;
          const response = await api.put(url, department);
          const savedDep = response.data;
          savedDep.employees = department.employees;
          commit("changeDepartment", savedDep);
        } else {
          const url = `/department`;
          const response = await api.post(url, {
            departmentName: department.departmentName,
            company: {
              id: 1
            },
            employees: []
          });
          const savedDep = response.data;
          savedDep.employees = [];
          commit("addDepartment", savedDep);
          commit("setSelectDepartment", savedDep)
        }
      } catch (error) {
        console.error(error);
      }
    },
  }
}
