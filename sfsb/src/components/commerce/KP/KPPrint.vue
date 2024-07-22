<template lang="pug" src="./FormKP.pug"></template>

<script setup lang="ts">
import {useRoute} from "vue-router";
import {storeToRefs} from "pinia";
import {useKPStore} from "@/pinia-store/kp";
import {computed, type Ref, ref, watch, watchEffect} from "vue";
import {useCompaniesStore} from "@/pinia-store/companies";
import {useCustomersStore} from "@/pinia-store/customers";
import router from "@/router";
import {useStaffStore} from "@/pinia-store/staff";
import wait from "@/mixins/wait";
import {useOrdersStore} from "@/pinia-store/orders";

const route = useRoute(),
    {loading} = storeToRefs(useKPStore()),
    {get} = useKPStore(),
    {getKP} = useOrdersStore()

const {companies} = storeToRefs(useCompaniesStore()),
    {fetchCompaniesData} = useCompaniesStore()

const {customers} = storeToRefs(useCustomersStore()),
    {fetchCustomers} = useCustomersStore()

const {staff} = storeToRefs(useStaffStore()),
    {getAllStaff} = useStaffStore()

const company = ref<Company | null>(null),
    customer = ref<Customer | null>(null),
    user = ref<Person | null>(null),
    offer = ref<KP | null>(null),
    imageRef = ref<HTMLImageElement | undefined>(),
    imgIsLoaded = ref(false)
const totalPrice = computed(() => {
    return offer.value?.items.map(e => e.amount * e.itemPrice).reduce((e, acc) => acc + e, 0) || 0
})
const totalAmount = computed(() => {
    return offer.value?.items.map(e => e.amount).reduce((e, acc) => acc + e, 0) || 0
})

const canPrint = computed(() => {
    return !!company.value
        && !!customer.value
        && !!user.value
        && !!offer.value
})

watch([imgIsLoaded], async () => {
    await wait(1000)
    canPrint.value && imageRef.value?.complete && print()
})


const print = () => window.print()

const close = () => {
    router.back()
}

const imageLoadTrigger = (link: string, flag: Ref) => {
    const img = new Image();
    img.src = link
    img.addEventListener('load', function () {
        if (img.height > 0 && img.width > 0) {
            console.log('Изображение загружено');
            flag.value = true
        }
    });
}

const dataTransferToModel = async (data: any) => {
    data && (offer.value = data)
    !companies.value.length && await fetchCompaniesData()
    company.value = companies.value.find(e => e.id === data?.companyId) || null
    !customers.value.length && await fetchCustomers()
    customer.value = customers.value.find(e => e.id === data?.customerId) || null
    !staff.value.length && await getAllStaff()
    user.value = staff.value.find(e => e.id === data?.createdBy) || null
}

const loadData = (query: () => Promise<any>) => async () => {
    const data = await query()
    await dataTransferToModel(data)
    imageLoadTrigger(company.value?.logo?.link || "", imgIsLoaded)
}

const loadDataFromKP = loadData(async () => await get<KP>(+route.params.id))
const loadDataFromDoc = loadData(async () => await getKP(+route.params.id, +route.params.company))

watchEffect(() => {
    console.log("KPPrint", route)
    const ROUTE_MAP: Record<string, Function> = {
        ["КП принт"]: loadDataFromKP,
        ["Заказ принт"]: loadDataFromDoc
    } as const
    ROUTE_MAP[route.meta.name as string]()
})
</script>

<style scoped lang="sass">
@import "./StyleKP"
</style>
