<template lang="pug">
    v-form.overflow-auto(ref="form" v-model="valid" v-on:submit.prevent="void save")
        v-card.mx-auto(:loading)
            v-card-title
                span.text-h4 {{companyLocal.companyName}}
            v-card-text
                v-container
                    v-row
                        v-col(cols="12")
                            v-text-field(label="Название организации*" ref="orgName" v-model="companyLocal.companyName" :rules="[rules.required, rules.counter]" counter maxlength="200" )
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
                            v-text-field(label="Банк" v-model="companyLocal.bank" :rules="[ rules.counter]" placeholder="ОАО ВТБ" counter maxlength="200")
                        v-col( cols="12" sm="6" md="4")
                            v-text-field(label="Расчетный счет" v-model="companyLocal.paymentAccount" :rules="[rules.accountWithEmptyValidation]" counter)
                        v-col( cols="12" sm="6" md="4")
                            v-text-field(label="БИК" v-model="companyLocal.bik" :rules="[rules.bikkppWithEmptyValidation]" counter)
                    v-row
                        v-col(cols="12" sm="6" md="4")
                            v-text-field(label="Корсчет" v-model="companyLocal.correspondentAccount" :rules="[rules.accountWithEmptyValidation]" counter)
            v-card-actions
                //v-btn(color="orange-darken-1" variant="text" @click="show=false") Закрыть
                v-btn(color="orange-darken-1" variant="text" type="submit" :disabled="!valid") Сохранить
                v-spacer
                v-btn(color="orange-darken-1" variant="text") Создать

</template>
<script setup lang="ts">
import {ref, toRefs, watch} from "vue";
import {useValidationRules} from "@/mixins/FieldValidationRules";

const props = defineProps<{ company: PartialCustomer, loading: boolean }>();
const {company, loading} = toRefs(props)
const companyLocal = ref(company.value)

const form = ref<HTMLFormElement>()
const valid = ref(false);
const {rules} = useValidationRules();

const save = () => {
}

watch([company], () => {
    companyLocal.value = company.value
})
</script>
<style scoped lang="sass">

</style>
