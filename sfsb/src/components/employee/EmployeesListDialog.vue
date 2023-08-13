<template>
  <v-list dense>
    <v-list-item
      v-for="employee in selectDepartment.employees"
      :key="employee.id"
      :value="employee"
      :title="employee.firstName + ' ' + employee.lastName + ' ' + employee.position"
      @click.stop="selectEmployee(employee)">
      <template v-slot:append>
        <v-btn
          color="orange-lighten-1"
          icon="mdi-delete"
          variant="text"
          @click.stop="deleteEmployeeFromDepartment(employee)"
        ></v-btn>
      </template>
    </v-list-item>
    <v-list-item :disabled="createEmployeeActive">
      <v-list-item-title>
        Добавить сотрудника
      </v-list-item-title>
      <template v-slot:append>
        <v-btn
          color="orange-lighten-1"
          icon="mdi-plus"
          variant="text"
          @click.stop="selectEmployee({ department: { id: selectDepartment.id } })"
        ></v-btn>
      </template>
    </v-list-item>
  </v-list>
</template>
<script>
import {computed} from "vue";
import {useStore} from "vuex";

export default {
  name: "employees-list-dialog",
  setup() {
    const store = useStore();

    const selectDepartment = computed(() => store.getters.getSelectDepartment);

    const createEmployeeActive = computed(() => Object.keys(store.getters.getSelectDepartment).length <= 0);

    const selectEmployee = (employee) => {
      store.commit("setEmployee", employee);
      store.commit("setEmployeeDialog", true);
    };

    const deleteEmployeeFromDepartment = (employee) => {
      const department = {...selectDepartment.value};
      department.employees = department.employees.filter((emp) => emp.id !== employee.id);
      store.commit("setEmployees", department.employees);
      store.commit("setSelectDepartment", department);
      store.commit("changeDepartment", department);
      employee.department = null;
      store.dispatch("saveEmployee", employee);
    };

    return {
      selectDepartment,
      createEmployeeActive,
      selectEmployee,
      deleteEmployeeFromDepartment,
    };
  },
};
</script>
