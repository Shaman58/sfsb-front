<template>
  <v-dialog v-model="isCompanyDialogVisible" width="1024">
    <v-form ref="form" v-model="valid" v-on:submit.prevent="save()">
      <v-card class="mx-auto my-12">
        <v-card-title>
          <span class="text-h5">Карточка организации</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  label="Название организации*"
                  v-model="company.companyName"
                  :rules="[rules.required, rules.counter]"
                  counter
                  maxlength="200">
                </v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  label="Адрес*"
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
                <v-text-field
                  label="Email*"
                  v-model="company.email"
                  :rules="[rules.required, rules.emailValidation]"
                  placeholder="example@exe.com">
                </v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="6">
                <v-text-field
                  label="Телефон*"
                  v-model="company.phoneNumber"
                  :rules="[rules.required, rules.phoneValidation]"
                  placeholder="+7 (4321) 23-34-45">
                </v-text-field>
              </v-col>

            </v-row>
            <v-row>

              <v-col cols="12" sm="6" md="4">
                <v-text-field
                  label="ИНН*"
                  v-model="company.inn"
                  :rules="[rules.innValidation]"
                  counter>
                </v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-text-field
                  label="КПП*"
                  v-model="company.kpp"
                  :rules="[rules.bikkppValidation]"
                  counter>
                </v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-text-field
                  label="ОКПО*"
                  v-model="company.ogrn"
                  :rules="[rules.ogrnValidation]"
                  counter>
                </v-text-field>
              </v-col>

            </v-row>
            <v-row>

              <v-col cols="12" sm="6" md="4">
                <v-text-field
                  label="Банк*"
                  v-model="company.bank"
                  :rules="[rules.required, rules.counter]"
                  placeholder="ОАО ВТБ"
                  counter
                  maxlength="200">
                </v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-text-field
                  label="Расчетный счет*"
                  v-model="company.paymentAccount"
                  :rules="[rules.accountValidation]"
                  counter>
                </v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-text-field
                  label="БИК*"
                  v-model="company.bik"
                  :rules="[rules.bikkppValidation]"
                  counter>
                </v-text-field>
              </v-col>

            </v-row>
            <v-row>

              <v-col cols="12" sm="6" md="4">
                <v-text-field
                  label="Корсчет*"
                  v-model="company.correspondentAccount"
                  :rules="[rules.accountValidation]"
                  counter>
                </v-text-field>
              </v-col>
              <v-col cols="8" sm="8" v-if=isCompanyHasDirector>
                <v-select
                  v-if="employees"
                  :items="employees"
                  :item-title="'lastName'"
                  return-object
                  v-model="company.director"
                  label="Директор">
                </v-select>
              </v-col>
              <v-col cols="8" v-else-if="isCompanyCreated">
                <v-btn @click="showContacts">Контакты</v-btn>
              </v-col>

            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="orange-darken-1" variant="text" @click="hideCompanyDialog">
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
import {useStore} from "vuex";
import {computed, ref} from "vue";

export default {
  name: "company-create-dialog",
  setup() {
    const store = useStore();

    const form = ref(null);
    const valid = ref(false);

    const company = computed(() => store.getters.getSelectedCompany);
    const isCompanyDialogVisible = computed(() => store.getters.isCompanyDialogVisible);
    const employees = computed(() => store.getters.getEmployees);

    const isCompanyHasDirector = computed(() => {
      return company.value.hasOwnProperty('director');
    });

    const isCompanyCreated = computed(() => {
      return company.value.hasOwnProperty('id');
    });

    const hideCompanyDialog = () => {
      store.commit("setCompanyDialog", false);
    };

    const save = () => {
      if (form.value.validate()) {
        if (isCompanyHasDirector.value) {
          store.dispatch("saveCompany", company.value)
        } else {
          store.dispatch("saveCustomer", company.value);
        }
        hideCompanyDialog();
      }
    };

    const showContacts = () => {
      store.commit("setContactListDialogVisible", true);
    };

    const rules = {
      required: value => !!value || 'Обязательное поле',
      counter: value => value.length <= 200 || 'Не более 200 символов',
      emailValidation: value => {
        const pattern = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/
        return pattern.test(value) || 'Неверный формат'
      },
      phoneValidation: value => {
        const pattern = /^\+?[78][-\(]?\d{3}\)?-?\d{3}-?\d{2}-?\d{2}$/
        return pattern.test(value) || 'Неверный формат'
      },
      accountValidation: value => {
        const pattern = /^[0-9]{20}$/
        return pattern.test(value) || 'Неверный формат, введите 20 цифр'
      },
      bikkppValidation: value => {
        const pattern = /^[0-9]{9}$/
        return pattern.test(value) || 'Неверный формат, введите 9 цифр'
      },
      ogrnValidation: value => {
        const pattern = /^[0-9]{13}$/
        return pattern.test(value) || 'Неверный формат, введите 13 цифр'
      },
      innValidation: value => {
        const pattern = /^[0-9]{10}$/
        return pattern.test(value) || 'Неверный формат, введите 10 цифр'
      },
    };

    return {
      hideCompanyDialog,
      company,
      isCompanyDialogVisible,
      form,
      valid,
      rules,
      save,
      employees,
      isCompanyHasDirector,
      showContacts,
      isCompanyCreated
    }
  }
}
</script>
