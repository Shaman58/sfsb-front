<template>
    <v-form class="company__form" ref="form" v-model="valid" v-on:submit.prevent="save(company)" style="overflow-y: auto;">
        <v-card class="mx-auto my-12">
            <v-card-title>
                <span class="text-h5">Карточка организации</span>
            </v-card-title>
            <v-card-text>
                <v-container>
                    <v-row>
                        <v-col cols="12">
                            <v-text-field label="Название организации*" v-model="company.companyName"
                                :rules="[rules.required, rules.counter]" counter maxlength="200">
                            </v-text-field>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="12">
                            <v-text-field label="Адрес*" v-model="company.address" :rules="[rules.required, rules.counter]"
                                placeholder="г. Заречный ул. Мира 12" counter maxlength="200">
                            </v-text-field>
                        </v-col>

                    </v-row>
                    <v-row>

                        <v-col cols="12" sm="6" md="6">
                            <v-text-field label="Email*" v-model="company.email"
                                :rules="[rules.required, rules.emailValidation]" placeholder="example@exe.com">
                            </v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="6">
                            <v-text-field label="Телефон*" v-model="company.phoneNumber"
                                :rules="[rules.required, rules.phoneValidation]" placeholder="+7 (4321) 23-34-45">
                            </v-text-field>
                        </v-col>

                    </v-row>
                    <v-row>

                        <v-col cols="12" sm="6" md="4">
                            <v-text-field label="ИНН*" v-model="company.inn" :rules="[rules.innValidation]" counter>
                            </v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                            <v-text-field label="КПП*" v-model="company.kpp" :rules="[rules.bikkppValidation]" counter>
                            </v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                            <v-text-field label="ОКПО*" v-model="company.ogrn" :rules="[rules.ogrnValidation]" counter>
                            </v-text-field>
                        </v-col>

                    </v-row>
                    <v-row>

                        <v-col cols="12" sm="6" md="4">
                            <v-text-field label="Банк*" v-model="company.bank" :rules="[rules.required, rules.counter]"
                                placeholder="ОАО ВТБ" counter maxlength="200">
                            </v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                            <v-text-field label="Расчетный счет*" v-model="company.paymentAccount"
                                :rules="[rules.accountValidation]" counter>
                            </v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                            <v-text-field label="БИК*" v-model="company.bik" :rules="[rules.bikkppValidation]" counter>
                            </v-text-field>
                        </v-col>

                    </v-row>
                    <v-row>

                        <v-col cols="12" sm="6" md="4">
                            <v-text-field label="Корсчет*" v-model="company.correspondentAccount"
                                :rules="[rules.accountValidation]" counter>
                            </v-text-field>
                        </v-col>
                    </v-row>
                </v-container>
            </v-card-text>
            <v-card-actions>
                <v-spacer />
                <v-btn color="orange-darken-1" variant="text" @click="hide">
                    Закрыть
                </v-btn>
                <v-btn color="orange-darken-1" variant="text" type="submit" :disabled="!valid">
                    Сохранить
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-form>
</template>

<script setup lang="ts">
import { useValidationRules } from "@/mixins/FieldValidationRules";
import { useStore } from "vuex";
import {computed, Ref, ref, watch} from "vue";
import { useCompanyStore } from "@/pinia-store/company"
import { storeToRefs } from "pinia"
import { useRouter } from "vue-router"

const { company } = storeToRefs(useCompanyStore())
const { fetchCompanyData, saveCompany } = useCompanyStore()
await fetchCompanyData()

const emit = defineEmits();
const { rules } = useValidationRules();
const store = useStore();

const form: Ref<HTMLFormElement | null> = ref(null);
const valid = ref(false);

const router = useRouter();

const hide = () => {
    router.push("/")
};

const save = (data: Company) => {
    if (form.value && form.value.validate()) {
        saveCompany(data)
    }
};

//TODO: проверить валидацию
</script>

<style scoped lang="sass">
.company__form
    width: 100%
</style>
