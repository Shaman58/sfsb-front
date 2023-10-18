<template>
  <v-dialog v-model="props.visible" width="768" persistent>
    <v-form ref="form" v-model="valid" @submit.prevent="save(employee)" style="overflow-y: auto;">
      <v-card>
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
              <v-col cols="6">
                <v-text-field
                  label="Должность"
                  v-model="employee.position"
                  :rules="[rules.required, rules.counter]"
                  counter
                  maxlength="20"
                ></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-select v-if="departments"
                          label="Отдел"
                          :items="departments"
                          item-title="departmentName"
                          return-object
                          v-model="employee.department"
                          :rules="[rules.required]"
                />
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
          <v-btn color="orange-darken-1" variant="text" @click="hide">
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
import {ref} from "vue";
import {useStore} from "vuex";
import {useValidationRules} from "@/mixins/FieldValidationRules";

const props = defineProps({
  visible: {
    type: Boolean,
    required: true
  },
  employee: {
    type: Object,
    required: true
  },
  departments: {
    type: Object,
    required: false
  }
});

const store = useStore();
const emit = defineEmits();

const form = ref(null);
const valid = ref(false);
const employee = ref({...props.employee});

const {rules} = useValidationRules();

const save = (data) => {
  if (form.value.validate()) {
    emit("save", data);
    hide();
  }
};

const hide = () => {
  emit("hide");
  employee.value = {...props.employee};
};

</script>
