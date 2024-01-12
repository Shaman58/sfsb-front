<template lang="pug">
.company
    .company__header
        .d-flex.justify-center.align-center.ga-2
            h1 {{currentCompany.companyName||"НОВАЯ КОМПАНИЯ"}}
            img.company__logo(v-if="currentCompany.logo" alt="logo" :src="currentCompany.logo.link")
    v-form.company__form(ref="form" v-model="valid" @submit="save")
        v-card.company__cards
            v-card.company__card(title="Общие данные" prepend-icon="mdi-home"  )
                v-text-field(label="Название организации" variant="underlined" v-model="currentCompany.companyName")
                v-text-field(label="Адрес" variant="underlined" v-model="currentCompany.address")
                .d-flex
                    v-text-field(label="ИНН" variant="underlined" v-model="currentCompany.inn")
                    v-text-field(label="КПП" variant="underlined" v-model="currentCompany.kpp")
                    v-text-field(label="ОГРН" variant="underlined" v-model="currentCompany.ogrn")
            v-card.company__card(title="Банковские реквизиты" prepend-icon="mdi-bank" )
                v-text-field(label="Банк" variant="underlined" v-model="currentCompany.bank")
                .d-flex
                    v-text-field(label="Расчетный счет" variant="underlined" v-model="currentCompany.paymentAccount")
                    v-text-field(label="БИК" variant="underlined" v-model="currentCompany.bik")
                    v-text-field(label="Корреспонденский счет" variant="underlined" v-model="currentCompany.correspondentAccount")
            v-card.company__card(title="Контактные данные" prepend-icon="mdi-mail" )
                .d-flex
                    v-text-field(label="email" variant="underlined" v-model="currentCompany.email")
                    v-text-field(label="телефон" variant="underlined" v-model="currentCompany.phoneNumber")
    .company__footer
        v-btn(@click="()=>route.params.id==='new'?add():save()" variant="plain" ) Сохранить
        v-btn(@click="hide" variant="plain" ) На главную
    //v-form.company__form(ref="form" v-model="valid" v-on:submit.prevent="save(currentCompany)" style="overflow-y: auto;")
        v-card(class="mx-auto my-12")
            v-card-title
                span.text-h5 Карточка организации
            v-card-text
                v-container
                    v-row
                        v-col(cols="12")
                            v-text-field(label="Название организации*" v-model="currentCompany.companyName" :rules="[rules.required, rules.counter]" counter maxlength="200")
                    v-row
                        v-col(cols="12")
                            v-text-field(label="Адрес*" v-model="company.address" :rules="[rules.required, rules.counter]" counter maxlength="200")

    <!--                    <v-row>-->

    <!--                        <v-col cols="12" sm="6" md="6">-->
    <!--                            <v-text-field label="Email*" v-model="company.email"-->
    <!--                                :rules="[rules.required, rules.emailValidation]" placeholder="example@exe.com">-->
    <!--                            </v-text-field>-->
    <!--                        </v-col>-->
    <!--                        <v-col cols="12" sm="6" md="6">-->
    <!--                            <v-text-field label="Телефон*" v-model="company.phoneNumber"-->
    <!--                                :rules="[rules.required, rules.phoneValidation]" placeholder="+7 (4321) 23-34-45">-->
    <!--                            </v-text-field>-->
    <!--                        </v-col>-->

    <!--                    </v-row>-->
    <!--                    <v-row>-->

    <!--                        <v-col cols="12" sm="6" md="4">-->
    <!--                            <v-text-field label="ИНН*" v-model="company.inn" :rules="[rules.innValidation]" counter>-->
    <!--                            </v-text-field>-->
    <!--                        </v-col>-->
    <!--                        <v-col cols="12" sm="6" md="4">-->
    <!--                            <v-text-field label="КПП*" v-model="company.kpp" :rules="[rules.bikkppValidation]" counter>-->
    <!--                            </v-text-field>-->
    <!--                        </v-col>-->
    <!--                        <v-col cols="12" sm="6" md="4">-->
    <!--                            <v-text-field label="ОКПО*" v-model="company.ogrn" :rules="[rules.ogrnValidation]" counter>-->
    <!--                            </v-text-field>-->
    <!--                        </v-col>-->

    <!--                    </v-row>-->
    <!--                    <v-row>-->

    <!--                        <v-col cols="12" sm="6" md="4">-->
    <!--                            <v-text-field label="Банк*" v-model="company.bank" :rules="[rules.required, rules.counter]"-->
    <!--                                placeholder="ОАО ВТБ" counter maxlength="200">-->
    <!--                            </v-text-field>-->
    <!--                        </v-col>-->
    <!--                        <v-col cols="12" sm="6" md="4">-->
    <!--                            <v-text-field label="Расчетный счет*" v-model="company.paymentAccount"-->
    <!--                                :rules="[rules.accountValidation]" counter>-->
    <!--                            </v-text-field>-->
    <!--                        </v-col>-->
    <!--                        <v-col cols="12" sm="6" md="4">-->
    <!--                            <v-text-field label="БИК*" v-model="company.bik" :rules="[rules.bikkppValidation]" counter>-->
    <!--                            </v-text-field>-->
    <!--                        </v-col>-->

    <!--                    </v-row>-->
    <!--                    <v-row>-->

    <!--                        <v-col cols="12" sm="6" md="4">-->
    <!--                            <v-text-field label="Корсчет*" v-model="company.correspondentAccount"-->
    <!--                                :rules="[rules.accountValidation]" counter>-->
    <!--                            </v-text-field>-->
    <!--                        </v-col>-->
    <!--                    </v-row>-->
    <!--                </v-container>-->
    <!--            </v-card-text>-->
    <!--            <v-card-actions>-->
    <!--                <v-spacer />-->
    <!--                <v-btn color="orange-darken-1" variant="text" @click="hide">-->
    <!--                    Закрыть-->
    <!--                </v-btn>-->
    <!--                <v-btn color="orange-darken-1" variant="text" type="submit" :disabled="!valid">-->
    <!--                    Сохранить-->
    <!--                </v-btn>-->
    <!--            </v-card-actions>-->
    <!--        </v-card>-->
    <!--    </v-form>-->
</template>

<script setup lang="ts">
import {useValidationRules} from "@/mixins/FieldValidationRules";
import {ref} from "vue";
import {useRouter, useRoute} from "vue-router"
import {useCompaniesStore} from "@/pinia-store/companies";

const {getCompanyById, saveCompany, addCompany} = useCompaniesStore()

const form: Ref<HTMLFormElement | null> = ref(null);
const valid = ref(false);

const router = useRouter();
const route = useRoute();

const initialCompany: Company = {
    companyName:"",
    id:0,
    bik:0,
    bank:"",
    address:"",
    created: null,
    inn: 0,
    kpp: 0,
    email: "",
    ogrn: 0,
    correspondentAccount: 0,
    updated: null,
    phoneNumber: "",
    paymentAccount: 0,
    logo: null
}
const currentCompany = ref(initialCompany)
const result = await getCompanyById(+route.params.id)
currentCompany.value = {...result} as Company|| {} as Company

const hide = () => {
    router.push("/")
};
const save = () => {
    if (form.value && form.value.validate()) {
        saveCompany(currentCompany.value)
    }
};
const add = () => {
    if (form.value && form.value.validate()) {
        addCompany(currentCompany.value)
    }
};


//TODO: проверить валидацию
</script>

<style scoped lang="sass">
.company
    --bg-color: #eee
    padding-top: 2rem
    background-color: var(--bg-color)

    &__header
        width: 100%
        height: 100px
    &__logo
        height: 100%
        object-fit: contain
    &__form
        width: 100%
    &__cards
        padding: 1rem
        background-color: var(--bg-color)
        display: flex
        flex-direction: column
        gap: 1rem
    &__card
        padding: 1rem
        background-color: #fff
    &__footer
        position: fixed
        bottom: 0
        width: 100%
        padding: 1rem
        background-color: var(--bg-color)

</style>
