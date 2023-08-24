<template>
  <v-container>
    <v-dialog v-model="mainDialogVisible" width="800">
      <v-card>
        <v-card-title>
          <span class="text-h5">Отделы</span>
        </v-card-title>
        <v-list density="compact">
          <v-list-item v-for="department in departments" :key="department.id" :value="department">
            <v-list-item-title @click="selectDepartment(department)">
              {{ department.departmentName }}
            </v-list-item-title>
            <template v-slot:append>
              <v-btn
                color="orange-lighten-1"
                icon="mdi-delete"
                variant="text"
                :disabled="department.employees.length !== 0"
                @click.stop="deleteDepartment(department)"
              ></v-btn>
            </template>
          </v-list-item>
<!--          <v-list-item>-->
<!--            <v-list-item-title>-->
<!--              ...-->
<!--            </v-list-item-title>-->
<!--            <template v-slot:append>-->
<!--              <v-btn-->
<!--                color="orange-lighten-1"-->
<!--                icon="mdi-plus"-->
<!--                variant="text"-->
<!--                @click.stop="selectDepartment({})"-->
<!--              ></v-btn>-->
<!--            </template>-->
<!--          </v-list-item>-->
        </v-list>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="orange-darken-1" variant="text" @click="hideMainDialog">Закрыть</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import {computed} from "vue";
import {useStore} from "vuex";

export default {
  name: "department-list-dialog",
  setup() {
    const store = useStore();

    const departments = computed(() => store.getters.getDepartments);
    const mainDialogVisible = computed(() => store.getters.getMainDialog);

    const hideMainDialog = () => {
      store.commit("setMainDialog", false);
    };

    const deleteDepartment = (department) => {
      store.dispatch("deleteDepartment", department)
    };

    const selectDepartment = (department) => {
      store.commit("setSelectDepartment", {...department});
      store.commit("setDepartmentCreateDialog", true);
      store.commit("setEmployees", department.employees);
    };

    return {
      departments,
      mainDialogVisible,
      hideMainDialog,
      deleteDepartment,
      selectDepartment,
    };
  },
};
</script>
