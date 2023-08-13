<template>
  <v-dialog v-model="employeeDialogVisible" width="768">
    <v-form ref="form" v-model="valid" @submit.prevent="save()">
      <v-card>
        <v-card-title>
          <span v-if="isObjectHasDepartment" class="text-h5">Сотрудник</span>
          <span v-else class="text-h5">Контакт</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  label="Имя"
                  v-model="employee.firstName"
                  :rules="[rules.required, rules.counter]"
                  counter
                  maxlength="20"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  label="Фамилия"
                  v-model="employee.lastName"
                  :rules="[rules.required, rules.counter]"
                  counter
                  maxlength="20"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  label="Должность"
                  v-model="employee.position"
                  :rules="[rules.required, rules.counter]"
                  counter
                  maxlength="20"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  label="Email"
                  v-model="employee.email"
                  :rules="[rules.required, rules.counter, rules.emailValidation]"
                  counter
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  label="Телефон"
                  v-model="employee.phoneNumber"
                  :rules="[rules.required, rules.counter, rules.phoneValidation]"
                  counter
                  maxlength="20"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="orange-darken-1" variant="text" @click="hideEmployeeDialog">
            Закрыть
          </v-btn>
          <v-btn color="orange-darken-1" variant="text" type="submit" :disabled="!valid">
            Сохранить
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>
<script>
import {computed, ref} from "vue";
import {useStore} from "vuex";

export default {
  name: "employee-create-dialog",
  setup() {
    const store = useStore();

    const employeeDialogVisible = computed(() => store.getters.getEmployeeDialogVisible);
    const employee = computed(() => store.getters.getEmployee);

    const form = ref(null);
    const valid = ref(false);

    const rules = {
      required: (value) => !!value || "Обязательное поле",
      counter: (value) => value.length <= 200 || "Не более 200 символов",
      emailValidation: value => {
        const pattern = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/
        return pattern.test(value) || 'Неверный формат'
      },
      phoneValidation: value => {
        const pattern = /^\+7\s\(\d{4}\)\s\d{2}-\d{2}-\d{2}$/
        return pattern.test(value) || 'Неверный формат +X (XXXX) XX-XX-XX'
      },
    };

    const hideEmployeeDialog = () => {
      store.commit("setEmployeeDialog", false);
    };

    const isObjectHasDepartment = computed(() => {
      return 'department' in employee.value || employee.value.hasOwnProperty('department');
    });

    const save = () => {
      if (form.value.validate()) {
        isObjectHasDepartment.value ?
          store.dispatch("saveEmployee", employee.value) :
          store.dispatch("saveContact", employee.value);
        hideEmployeeDialog();
      }
    };

    return {
      employeeDialogVisible,
      employee,
      valid,
      rules,
      form,
      save,
      hideEmployeeDialog,
      isObjectHasDepartment
    };
  },
};
</script>
