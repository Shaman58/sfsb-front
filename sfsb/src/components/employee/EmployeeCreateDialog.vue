<template>
  <v-dialog v-model="employeeDialogVisible" width="768" persistent>
    <v-form ref="form" v-model="valid" @submit.prevent="save()" style="overflow-y: auto;">
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
<script setup>
import {computed, ref} from "vue";
import {useStore} from "vuex";
import {useValidationRules} from "@/mixins/FieldValidationRules";

const store = useStore();

const employeeDialogVisible = computed(() => store.getters.getEmployeeDialogVisible);
const employee = computed(() => store.getters.getEmployee);

const form = ref(null);
const valid = ref(false);

const {rules} = useValidationRules();

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
</script>
