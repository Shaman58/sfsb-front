<template>
  <v-dialog v-model="createDialogVisible" width="768">
    <v-form ref="formDep" v-model="validDep" @submit.prevent="saveDepartment()">
      <v-card>
        <v-card-title>
          <span class="text-h5">{{selectDepartment.departmentName}}</span>
        </v-card-title>
        <v-card-text>
          <v-container>
<!--            <v-row>-->
<!--              <v-col cols="12">-->
<!--                <v-text-field-->
<!--                  label="Название отдела"-->
<!--                  v-model="selectDepartment.departmentName"-->
<!--                  :rules="[rules.required, rules.counter, rules.nameValidation]"-->
<!--                  counter-->
<!--                  maxlength="200"-->
<!--                >-->
<!--                </v-text-field>-->
<!--              </v-col>-->
<!--            </v-row>-->
            <!--employees-->
            <employees-list-dialog/>
            <employee-create-dialog/>
            <!--employees-->
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="orange-darken-1" variant="text" @click="hideCreateDialog">
            Закрыть
          </v-btn>
<!--          <v-btn color="orange-darken-1" variant="text" type="submit" :disabled="!validDep">-->
<!--            Сохранить-->
<!--          </v-btn>-->
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script>
import {computed, ref} from "vue";
import {useStore} from "vuex";
import EmployeesListDialog from "@/components/employee/EmployeesListDialog.vue";
import EmployeeCreateDialog from "@/components/employee/EmployeeCreateDialog.vue";

export default {
  name: "department-create-dialog",
  components: {EmployeeCreateDialog, EmployeesListDialog},
  setup() {
    const store = useStore();

    const formDep = ref(null);
    const validDep = ref(false);

    const createDialogVisible = computed(() => store.getters.getCreateDialogVisible);
    const selectDepartment = computed(() => store.getters.getSelectDepartment);

    const rules = {
      required: (value) => !!value || "Обязательное поле",
      counter: (value) => value.length <= 200 || "Не более 200 символов",
      nameValidation: (value) => value.length >= 3 || "Минимальное количество символов: 3",
    };
    const hideCreateDialog = () => {
      store.commit("setDepartmentCreateDialog", false);
    };
    const saveDepartment = () => {
      if (formDep.value.validate()) {
        store.dispatch("saveDepartment", selectDepartment.value)
      }
    };

    return {
      createDialogVisible,
      selectDepartment,
      validDep,
      rules,
      formDep,
      hideCreateDialog,
      saveDepartment
    };
  },
};
</script>
