<template>
  <v-dialog v-model="props.visible" width="1024" persistent>
    <v-form ref="form" v-model="valid" v-on:submit.prevent="save(company)" style="overflow-y: auto;">
      <v-card class="mx-auto my-12">
        <v-card-title>
          <span class="text-h5">Карточка организации</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field label="Название организации*"
                              v-model="company.companyName"
                              :rules="[rules.required, rules.counter]"
                              counter
                              maxlength="200">
                </v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <v-text-field label="Адрес*"
                              v-model="company.address"
                              :rules="[rules.required, rules.counter]"
                              placeholder="г. Заречный ул. Мира 12"
                              counter
                              maxlength="200">
                </v-text-field>
              </v-col>

            </v-row>
            <v-row>

              <v-col cols="12" sm="6" md="6">
                <v-text-field label="Email*"
                              v-model="company.email"
                              :rules="[rules.required, rules.emailValidation]"
                              placeholder="example@exe.com">
                </v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="6">
                <v-text-field label="Телефон*"
                              v-model="company.phoneNumber"
                              :rules="[rules.required, rules.phoneValidation]"
                              placeholder="+7 (4321) 23-34-45">
                </v-text-field>
              </v-col>

            </v-row>
            <v-row>

              <v-col cols="12" sm="6" md="4">
                <v-text-field label="ИНН*"
                              v-model="company.inn"
                              :rules="[rules.innValidation]"
                              counter>
                </v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-text-field label="КПП*"
                              v-model="company.kpp"
                              :rules="[rules.bikkppValidation]"
                              counter>
                </v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-text-field label="ОКПО*"
                              v-model="company.ogrn"
                              :rules="[rules.ogrnValidation]"
                              counter>
                </v-text-field>
              </v-col>

            </v-row>
            <v-row>

              <v-col cols="12" sm="6" md="4">
                <v-text-field label="Банк*"
                              v-model="company.bank"
                              :rules="[rules.required, rules.counter]"
                              placeholder="ОАО ВТБ"
                              counter
                              maxlength="200">
                </v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-text-field label="Расчетный счет*"
                              v-model="company.paymentAccount"
                              :rules="[rules.accountValidation]"
                              counter>
                </v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-text-field label="БИК*"
                              v-model="company.bik"
                              :rules="[rules.bikkppValidation]"
                              counter>
                </v-text-field>
              </v-col>

            </v-row>
            <v-row>

              <v-col cols="12" sm="6" md="4">
                <v-text-field label="Корсчет*"
                              v-model="company.correspondentAccount"
                              :rules="[rules.accountValidation]"
                              counter>
                </v-text-field>
              </v-col>
              <v-col v-if="employees" cols="8" sm="8">
                <v-select :items="employees"
                          :item-title="'lastName'"
                          return-object
                          v-model="company.director"
                          label="Директор">
                </v-select>
              </v-col>
              <v-col v-else-if="company.id" cols="8" sm="8">
                <v-btn @click.stop="visible=true"
                >Контакты
                </v-btn>

                <employee-list :employees="company.contacts"
                               :visible="visible"
                               @hide="visible=false"
                               @save="saveContact($event)"
                               @remove="removeContact($event)"
                />
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer/>
          <v-btn color="orange-darken-1"
                 variant="text"
                 @click="hide">
            Закрыть
          </v-btn>
          <v-btn color="orange-darken-1"
                 variant="text"
                 type="submit"
                 :disabled="!valid">
            Сохранить
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script setup>
import {useValidationRules} from "@/mixins/FieldValidationRules";
import {useStore} from "vuex";
import {computed, ref, watch} from "vue";
import EmployeeList from "@/components/employee/EmployeeList.vue";

const props = defineProps({
  company: {
    type: Object,
    required: true
  },
  employees: {
    type: Array,
    required: false
  },
  visible: {
    type: Boolean,
    required: true
  }
});

const emit = defineEmits();
const {rules} = useValidationRules();
const store = useStore();

const form = ref(null);
const valid = ref(false);
const visible = ref(false);

const company = ref({...props.company});

watch(
  () => props.company,
  () => {
    company.value = {...props.company};
  }
);

const hide = () => {
  emit("hide");
  company.value = {...props.company};
};

const save = (data) => {
  if (form.value.validate()) {
    emit("save", data);
    emit("hide");
  }
};

const saveContact = (data) => {
  data.customer = company.value;     //разобраться с обновлением
  emit("saveContact", data);
};

const removeContact = (data) => {
  emit("removeContact", data);
};

</script>
