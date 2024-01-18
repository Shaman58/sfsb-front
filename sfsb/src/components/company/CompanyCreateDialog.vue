<template lang="pug">
    v-dialog(:model-value="visible" width="1024")
        v-form(ref="form" v-model="valid" v-on:submit.prevent="save" style="overflow-y: auto;")
            v-card.mx-auto.my-12
                v-card-title
                    span.text-h5 Карточка организации
                v-card-text
                    v-container
                        v-row
                            v-col(cols="12")
                                v-text-field(label="Название организации*" v-model="companyLocal.companyName" :rules="[rules.required, rules.counter]" counter maxlength="200")
                        v-row
                            v-col(cols="12")
                                v-text-field(label="Адрес*" v-model="companyLocal.address" :rules="[rules.required, rules.counter]" placeholder="г. Заречный ул. Мира 12" counter maxlength="200")
                        v-row
                            v-col( cols="12" sm="6" md="6")
                                v-text-field(label="Email*" v-model="companyLocal.email" :rules="[rules.required, rules.emailValidation]" placeholder="example@exe.com")
                            v-col( cols="12" sm="6" md="6")
                                v-text-field(label="Телефон*" v-model="companyLocal.phoneNumber" :rules="[rules.required, rules.phoneValidation]" placeholder="+7 (4321) 23-34-45")
                        v-row
                            v-col(cols="12" sm="6" md="4")
                                v-text-field(label="ИНН*" v-model="companyLocal.inn" :rules="[rules.innValidation]" counter)
                            v-col(cols="12" sm="6" md="4")
                                v-text-field(label="КПП*" v-model="companyLocal.kpp" :rules="[rules.bikkppValidation]" counter)
                            v-col(cols="12" sm="6" md="4")
                                v-text-field(label="ОКПО*" v-model="companyLocal.ogrn" :rules="[rules.ogrnValidation]" counter)
                        v-row
                            v-col( cols="12" sm="6" md="4")
                                v-text-field(label="Банк*" v-model="companyLocal.bank" :rules="[rules.required, rules.counter]" placeholder="ОАО ВТБ" counter maxlength="200")
                            v-col( cols="12" sm="6" md="4")
                                v-text-field(label="Расчетный счет*" v-model="companyLocal.paymentAccount" :rules="[rules.accountValidation]" counter)
                            v-col( cols="12" sm="6" md="4")
                                v-text-field(label="БИК*" v-model="companyLocal.bik" :rules="[rules.bikkppValidation]" counter)
                        v-row
                            v-col(cols="12" sm="6" md="4")
                                v-text-field(label="Корсчет*" v-model="companyLocal.correspondentAccount" :rules="[rules.accountValidation]" counter)
                v-card-actions
                    v-spacer
                    v-btn(color="orange-darken-1" variant="text" @click="hide") Закрыть
                    v-btn(color="orange-darken-1" variant="text" type="submit" :disabled="!valid") Сохранить
</template>

<script setup lang="ts">
import {useValidationRules} from "@/mixins/FieldValidationRules";
import {ref} from "vue";

const {visible, company} = defineProps<{ company: Company | Customer | object, visible: boolean }>();

const emit = defineEmits();
const {rules} = useValidationRules();

const form = ref(null);
const valid = ref(false);

const companyLocal = ref({...company});


// watch(
//     () => props.company,
//     () => {
//         company.value = {...props.company};
//     }
// );

const hide = () => {
    emit("hide");
    companyLocal.value = {...company};
};

const save = () => {
    if (form.value && form.value.validate()) {
        emit("save", companyLocal);
        emit("hide");
    }
};


</script>
