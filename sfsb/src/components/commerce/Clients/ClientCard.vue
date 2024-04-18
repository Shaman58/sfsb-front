<template lang="pug">
    LayoutMain.clients-card
        v-form.overflow-auto(ref="form" v-model="valid" @submit.prevent="save")
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
                                PhoneNumber(v-model="companyLocal.phoneNumber")
                                //v-text-field(label="Телефон*" v-model="companyLocal.phoneNumber" :rules="[rules.required, rules.phoneValidation]" placeholder="+74321233445")
                        v-row
                            v-col(cols="12" sm="6" md="4")
                                v-text-field(label="ИНН*" v-model="companyLocal.inn" :rules="[rules.innValidation, rulesDouble]" counter)
                            v-col(cols="12" sm="6" md="4")
                                v-text-field(label="КПП*" v-model="companyLocal.kpp" :rules="[rules.bikkppValidation]" counter)
                            v-col(cols="12" sm="6" md="4")
                                v-text-field(label="ОКПО*" v-model="companyLocal.ogrn" :rules="[rules.okpoValidation]" counter)
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
        template(#footer)
            v-card.clients-card__footer
                v-btn(color="orange-darken-1" variant="text" type="submit" :disabled="!valid" @click="save") Сохранить


</template>
<script setup lang="ts">
import {computed, reactive, type Ref, ref, toRefs, watch, watchEffect} from "vue";
import {useValidationRules} from "@/mixins/FieldValidationRules";
import {useRoute} from "vue-router";
import {storeToRefs} from "pinia";
import {useCustomersStore} from "@/pinia-store/customers";
import LayoutMain from "@/components/common/LayoutMain.vue";
import {Empty} from "@/mixins/Empty";
import router from "@/router";
import PhoneNumber from "@/components/common/PhoneNumber.vue";

const {params} = toRefs(useRoute())

const {customers, loading} = storeToRefs(useCustomersStore())
const {saveCustomer} = useCustomersStore()

const companyLocal = reactive({...Empty.Company(), id: undefined})

const form = ref<HTMLFormElement>()
const valid = ref(false);
const {rules} = useValidationRules();

const save = async () => {
    const valid: { valid: boolean, errors: Ref<string[]> } = form.value && await form.value.validate()
    if (!valid.valid) return
    const res = await saveCustomer(companyLocal as Customer)
    res && await router.push(`/commerce/clients/${res.id}`)
}

const isDouble = computed(() => !!customers.value.find((e: Customer) => e.inn === companyLocal.inn))
const rulesDouble = (value: string) => {
    const company = customers.value.find((e: Customer) => e.inn == value)
    const companyName = company && company.companyName
    return params.value.id !== 'new' && !!company || `Такой ИНН существует у клиента ${companyName}`
}

watch([params], () => {
    const customer = params.value.id === "new"
        ? Empty.Company()
        : customers.value.find((e: Customer) => e.id === +params.value.id) || customers.value[0]
    Object.keys(companyLocal as Record<string, any>).forEach((key: string) => {
        (companyLocal as Record<string, any>)[key] = (customer as Record<string, any>)[key]
    })
}, {immediate: true})

// watch(() => companyLocal.phoneNumber, () => {
//     companyLocal.phoneNumber = companyLocal.phoneNumber.replace(/\D/g, '')
//         .replace(/^(\d)/, '($1')
//         .replace(/^(\(\d{3})(\d)/, '$1) $2')
//         .replace(/(\d{3})(\d{1,2})/, '$1-$2')
//         .replace(/(-\d{2})(\d{1,2})$/, '$1-$2')
//         .replace(/(-\d{2})(\d{2})(\d+)$/, '$1-$2')
// })

watchEffect(() => console.log("isDouble", isDouble.value))
</script>
<style scoped lang="sass">
.clients-card

    &__footer
        width: 100%
        height: 100%
        display: grid
        place-items: center start
</style>
