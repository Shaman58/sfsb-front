<template lang="pug">
    .company
        .company__header
            h1 {{currentCompany.companyName||"НОВАЯ КОМПАНИЯ"}}
            .company__logo-component
                img.company__logo(v-if="currentCompany?.logo?.link" alt="logo" :src="picture")
                input.company__file-logo(type="file" hidden @change="changeLogo" :accept="accept")
            .company__file-disclamer
                strong ВНИМАНИЕ!
                |  для корректного отображения логотипа предприятия
                |  в коммерческом предожении,
                |  пропорции сторон картинки должны быть 150 х 30
        v-form.company__form(ref="form" v-model="valid" @submit="save")
            v-card.company__cards
                v-card.company__card(title="Общие данные" prepend-icon="mdi-home"  )
                    v-text-field(label="Название организации" variant="underlined" v-model="currentCompany.companyName")
                    v-text-field(label="Адрес" variant="underlined" v-model="currentCompany.address")
                    .d-flex
                        v-text-field(label="ИНН" variant="underlined" v-model="currentCompany.inn" :rules="[rules.innValidation]")
                        v-text-field(label="КПП" variant="underlined" v-model="currentCompany.kpp" :rules="[rules.bikkppValidation]")
                        v-text-field(label="ОГРН" variant="underlined" v-model="currentCompany.ogrn" :rules="[rules.ogrnValidation]")
                v-card.company__card(title="Банковские реквизиты" prepend-icon="mdi-bank" )
                    v-text-field(label="Банк" variant="underlined" v-model="currentCompany.bank" :rules="[rules.required, rules.counter]")
                    .d-flex
                        v-text-field(label="Расчетный счет" variant="underlined" v-model="currentCompany.paymentAccount" :rules="[rules.accountValidation]")
                        v-text-field(label="БИК" variant="underlined" v-model="currentCompany.bik" :rules="[rules.bikkppValidation]")
                        v-text-field(label="Корреспонденский счет" variant="underlined" v-model="currentCompany.correspondentAccount" :rules="[rules.accountValidation]")
                v-card.company__card(title="Контактные данные" prepend-icon="mdi-mail" )
                    .d-flex
                        v-text-field(label="email" variant="underlined" v-model="currentCompany.email" :rules="[rules.required, rules.emailValidation]")
                        v-text-field(label="телефон" variant="underlined" v-model="currentCompany.phoneNumber" :rules="[rules.required, rules.phoneValidation]")
        .company__footer
            v-btn(@click="()=>route.params.id==='new'?add():save()" variant="plain" ) Сохранить
            v-btn(@click="hide" variant="plain" ) На главную

</template>

<script setup lang="ts">
import { useValidationRules } from "@/mixins/FieldValidationRules";
import { type Ref, ref } from "vue";
import { useRoute, useRouter } from "vue-router"
import { useCompaniesStore } from "@/pinia-store/companies";
import { useToast } from "vue-toast-notification";

const toast = useToast()

const { getCompanyById, saveCompany, addCompany, changeCompanyLogo } = useCompaniesStore()

const { rules } = useValidationRules()

const form: Ref<HTMLFormElement | null> = ref(null);
const valid = ref(false);

const router = useRouter();
const route = useRoute();

const accept = ".png, .jpg, .jpeg, .avif, .webp"

const initialCompany: Company = {
    companyName: "",
    id: 0,
    bik: "",
    bank: "",
    address: "",
    created: "",
    inn: "",
    kpp: "",
    email: "",
    ogrn: "",
    correspondentAccount: "",
    updated: null,
    phoneNumber: "",
    paymentAccount: "",
    logo: null
}
const currentCompany = ref(initialCompany)
const result = await getCompanyById(+route.params.id)

currentCompany.value = { ...result } as Company || {} as Company
const picture: Ref<string | ArrayBuffer | undefined> = ref(currentCompany.value.logo?.link)
const changeLogo = (event: Event) => {
    const target = event.target as HTMLInputElement
    if (target.files && target.files[0] && target.files[0].size > 1024 * 1024) return toast.error("Максимальный размер файла 1MB")
    const file = new FileReader()
    file.addEventListener("load", async (e: ProgressEvent<FileReader>) => {
        const fd = new FormData()
        target.files && fd.append("file", target.files[0])
        await changeCompanyLogo(fd, currentCompany.value.id)
        picture.value = e.target && e.target.result || ""
    })
    target && target.files && file.readAsDataURL(target.files[0])
}
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

</script>

<style scoped lang="sass">
.company
    padding-top: 2rem


    &__header
        width: 100%
        height: 100px
        display: flex
        align-items: center
        justify-content: center
        gap: 1rem

    &__logo-component
        min-height: 100px
        height: 100%
        min-width: 100px
        border: 1px solid #7777
        cursor: pointer
        position: relative

    &__logo
        inset: 0
        width: 100%
        height: 100%
        object-fit: contain

    &__file-logo
        display: block
        position: absolute
        inset: 0
        width: 100%
        height: 100%
        z-index: 2
        opacity: 0

    &__file-disclamer
        flex: 0 1 30%
        font-size: 0.9rem

    &__form
        width: 100%

    &__cards
        padding: 1rem
        display: flex
        flex-direction: column
        gap: 1rem

    &__card
        padding: 1rem

    &__footer
        position: fixed
        bottom: 0
        width: 100%
        padding: 1rem
        background-color: rgb(var(--v-theme-surface))

</style>
