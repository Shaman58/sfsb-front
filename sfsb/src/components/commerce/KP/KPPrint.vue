<template lang="pug">
    .print-form(@click="print")
        header.print-form__header
            .print-form__close(@click.stop="close")
                v-icon mdi-close
                span ЗАКРЫТЬ
            .print-form__company
                .print-form__company-logo
                    img(:src="company && company.logo?.link" alt="logo" @load="imgIsLoaded=true")
                .print-form__company-data
                    .print-form__company-common
                        .print-form__company-name {{ company && company.companyName }}
                        .print-form__company-address
                            span.print-form__label Адрес:
                            span.print-form__value {{ company && company.address }}
                        .print-form__company-contacts {{ company && company.contacts }}

                        .print-form__company-inn
                            span.print-form__label ИНН:
                            span.print-form__value {{ company && company.inn }}
                        .print-form__company-kpp
                            span.print-form__label КПП:
                            span.print-form__value {{ company && company.kpp }}
                        .print-form__company-ogrn
                            span.print-form__label ОГРН:
                            span.print-form__value {{ company && company.ogrn }}
                    .print-form__company-bank
                        .print-form__company-bank
                            span.print-form__label БАНК:
                            span.print-form__value {{ company && company.bank }}
                        .print-form__company-rs
                            span.print-form__label р/с:
                            span.print-form__value {{ company && company.paymentAccount }}
                        .print-form__company-bik
                            span.print-form__label БИК:
                            span.print-form__value {{ company && company.bik }}
                        .print-form__company-ks
                            span.print-form__label кор./с:
                            span.print-form__value {{ company && company.correspondentAccount }}
        main.print-form__main
            h1.print-form__main-title КОММЕРЧЕСКОЕ ПРЕДЛОЖЕНИЕ
            h3.print-form__main-number № {{ offer && offer.applicationNumber }}
            h3.print-form__to для {{ customer && customer.companyName }}
            p.print-form__proposal {{ offer && offer.businessProposal }}
            .print-form__grid
                .print-form__grid-row.print-form__grid-header
                    .print-form__grid-col.print-form__item-number Номер
                    .print-form__grid-col.print-form__item-decimal Децимал
                    .print-form__grid-col.print-form__item-name Название
                    .print-form__grid-col.print-form__item-price Цена (без НДС)
                    .print-form__grid-col.print-form__item-amount Кол-во
                    .print-form__grid-col.print-form__item-total Сумма (без НДС)
                .print-form__grid-row(v-for="(i,idx) in offer && offer.items")
                    .print-form__grid-col.print-form__item-number {{ idx + 1 }}
                    .print-form__grid-col.print-form__item-decimal {{ i.decimal }}
                    .print-form__grid-col.print-form__item-name {{ i.name }}
                    .print-form__grid-col.print-form__item-price {{ i.itemPrice.toFixed(2) }}
                    .print-form__grid-col.print-form__item-amount {{ i.amount }}
                    .print-form__grid-col.print-form__item-total {{ (i.amount * i.itemPrice).toFixed(2) }}
            .print-form__grid-row
                div
                div
                div
                .print-form__total  Итого:
                .print-form__total  {{ 1000 }}
                .print-form__total {{ totalPrice.toFixed(2).toLocaleString() }}
        footer.print-form__footer
            .print-form__contractor
                span.print-form__label Исполнитель:
                span.print-form__value {{user && user.firstName}} {{user && user.lastName}}
</template>

<script setup lang="ts">
import {useRoute} from "vue-router";
import {storeToRefs} from "pinia";
import {useKPStore} from "@/pinia-store/kp";
import {computed, nextTick, onMounted, ref, watch} from "vue";
import {useCompaniesStore} from "@/pinia-store/companies";
import {useCustomersStore} from "@/pinia-store/customers";
import router from "@/router";
import {useStaffStore} from "@/pinia-store/staff";

const route = useRoute()
const {loading} = storeToRefs(useKPStore())
const {get} = useKPStore()

const {companies} = storeToRefs(useCompaniesStore())
const {fetchCompaniesData} = useCompaniesStore()

const {customers} = storeToRefs(useCustomersStore())
const {fetchCustomers} = useCustomersStore()

const {staff} = storeToRefs(useStaffStore())
const {getAllStaff} = useStaffStore()

const company = ref<Company | null>(null)
const customer = ref<Customer | null>(null)
const user = ref<Person | null>(null)
const offer = ref<KP | null>(null)
const imgIsLoaded = ref(false)

const totalPrice = computed(() => {
    return offer.value?.items.map(e => e.amount * e.itemPrice).reduce((e, acc) => acc + e, 0) || 0
})

const canPrint = computed(() => {
    return imgIsLoaded
        && !!company.value
        && !!customer.value
        && !!user.value
        && !!offer.value
})

watch([canPrint], async () => {
    if (!canPrint.value) return
    await nextTick()
    window.print()
}, {immediate: true})

const print = () => {
    window.print()
}

const close = () => {
    router.push("/commerce/kp/" + route.params.id)
}

onMounted(async () => {
    const data = await get<KP>(+route.params.id)
    data && (offer.value = data)
    !companies.value.length && await fetchCompaniesData()
    company.value = companies.value.find(e => e.id === data?.companyId) || null
    !customers.value.length && await fetchCustomers()
    customer.value = customers.value.find(e => e.id === data?.customerId) || null
    !staff.value.length && await getAllStaff()
    user.value = staff.value.find(e => e.id === data?.managerUuid) || null
})
</script>

<style scoped lang="sass">
.print-form
    --pad: 1rem
    position: absolute
    top: 0
    left: 0
    width: 100vw
    z-index: 1010
    background: rgb(var(--v-theme-background))
    padding: var(--pad)

    & img
        display: block
        max-width: 100%
        max-height: 150px

    &__close
        cursor: pointer
        display: flex
        justify-content: center
        gap: 1ch
        align-items: center
        color: #f44
        margin-bottom: 1rem

        @media print
            display: none

    &__company
        display: grid
        grid-template-columns: 1fr 2fr
        gap: 1ch

        &-data
            display: grid
            grid-template-columns: repeat(2, 1fr)
            gap: 1ch

        &-logo
            display: grid
            place-items: center


    &__main

        &-title
            text-align: center
            margin-top: 2rem

        &-number
            text-align: center

    &__label
        font-weight: 700
        margin-right: 1ch

    &__grid
        border: 2px solid #777
        width: 100%

        &-row
            display: grid
            grid-template-columns: 1fr 3fr 3fr 1fr 1fr 2fr

        &-col
            padding: 1ch
            border: 1px solid #777
            font-size: clamp(10px, 18 / 1440 * 100vw, 18px)

        &-header
            & > *
                display: grid
                place-items: center
                font-weight: 700

    &__item

        &-number
            display: grid
            place-items: center

    &__total
        padding: 1ch
        font-size: clamp(10px, 18 / 1440 * 100vw, 18px)
        font-weight: 700

    &__proposal
        padding-block: 1rem

</style>
