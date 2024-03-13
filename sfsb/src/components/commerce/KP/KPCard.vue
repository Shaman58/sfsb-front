<template lang="pug">
    LayoutMain
        template(#header)
            div(:style="{height:'10px', width:'100%'}")
                v-progress-linear(indeterminate v-if="loading")
            v-card(width="100%")
                v-card-actions
                    KPBar(@save="saveKP" @copy="copyKP")
        template(#default v-if="currentKP" )
            v-card
                v-card-title
                    div(v-if="manager") Автор: {{manager && (manager.firstName + " " + manager.lastName)}}
                    v-row
                        v-col.py-0(lg="4")
                            v-text-field(v-model="currentKP.applicationNumber" label="Номер:" )
                        v-col.py-0(lg="4")
                            span Создан:
                            span {{new Date(currentKP.created).toLocaleDateString() + " " + new Date(currentKP.created).toLocaleTimeString()}}
                        v-col.py-0(lg="4" v-if="currentKP.updated" )
                            span Обновлен:
                            span {{new Date(currentKP.updated).toLocaleDateString() + " " + new Date(currentKP.updated).toLocaleTimeString()}}
                    v-row
                        v-col.py-0
                            v-select(:items="companies.map(e=>e.companyName)" :model-value="company?.companyName || companies[0].companyName" label="От: " @update:modelValue="changeCompany")
                        v-col.py-0
                            v-select(:items="customers.map(e=>e.companyName)" label="Для: ")
                    v-row
                        v-col.py-0(col="12")
                            v-text-field(v-model="currentKP.businessProposal" label="Оферта" )
                v-card-text
                    v-text-field.py-0(
                        v-model="search"
                        label="Фильтр"
                        prepend-inner-icon="mdi-magnify"
                        variant="outlined"
                        hide-details
                        single-line
                    )
                    suspended-component
                        KPItemsList(v-model:items="items" :search)



</template>

<script setup lang="ts">

import {useRoute, useRouter} from "vue-router";
import {useKPStore} from "@/pinia-store/kp";
import {computed, onBeforeUnmount, type Ref, ref, watch} from "vue";
import LayoutMain from "@/components/common/LayoutMain.vue";
import {storeToRefs} from "pinia";
import {useStaffStore} from "@/pinia-store/staff";
import {useCompaniesStore} from "@/pinia-store/companies";
import {useCustomersStore} from "@/pinia-store/customers";
import {Empty} from "@/mixins/Empty";
import KPItemsList from "@/components/commerce/KP/KPItemsList.vue";
import SuspendedComponent from "@/components/common/SuspendedComponent.vue";
import KPBar from "@/components/commerce/KP/KPBar.vue";
import {useCurrentUserStore} from "@/pinia-store/currentUser";

const router = useRouter()
const route = useRoute()
const {loading} = storeToRefs(useKPStore())
const {get, save} = useKPStore()

const currentKP: Ref<KP | null> = ref(null)
const items = ref<KPItem[]>([])


const search = ref("")

//--- CURRENT USER ---
const {user} = storeToRefs(useCurrentUserStore())

//--- MANAGER ---
const {staff} = storeToRefs(useStaffStore())
const {getAllStaff} = useStaffStore()
!staff.value.length && await getAllStaff()

const manager = computed<Person | undefined>(() => staff.value.find(e => e.id === currentKP.value?.managerUuid))

//--- COMPANY ---
const {companies} = storeToRefs(useCompaniesStore())
const {fetchCompaniesData} = useCompaniesStore()
!companies.value.length && await fetchCompaniesData()

const company = computed<Company | undefined>(() => companies.value.find(e => e.id === currentKP.value?.companyId))

//--- CUSTOMERS ---
const {customers} = storeToRefs(useCustomersStore())
const {fetchCustomers} = useCustomersStore()
!customers.value.length && await fetchCustomers()

// const customer = computed<Company|undefined>(()=>customers.value.find(e=>e.id===currentKP.value?.customerId))

const saveKP = async () => {
    const updated = currentKP.value?.updated || null
    const created = currentKP.value?.created || null
    const businessProposal = currentKP.value?.businessProposal || ""
    const applicationNumber = currentKP.value?.applicationNumber || 0
    const companyId = currentKP.value?.companyId || 0
    const managerUuid = currentKP.value?.managerUuid || user.value?.id || ""
    await save({
        ...currentKP.value,
        updated,
        created,
        businessProposal,
        applicationNumber,
        companyId,
        managerUuid,
        items: items.value
    })
}

const copyKP = () => {
    console.log("copy")
    router.push("/commerce/kp/new/" + currentKP.value?.id)
}
const changeCompany = (ev: string) => {
    const foundCompany = companies.value.find(e => e.companyName === ev)
    currentKP.value && (currentKP.value.companyId = foundCompany ? +foundCompany.id : 0)
}
//--- WATCH ---
const unwatchRoute = watch([route], async () => {
    console.log(route.params)
    if (!Number.isNaN(Number(+route.params.id))) {
        currentKP.value = (await get<KP>(+route.params.id)) || null
    }
    if (route.params.id === "new" && !route.params?.clone) {
        currentKP.value = Empty.KP()
        currentKP.value.items = [Empty.KPItem()]
        user.value && (currentKP.value.managerUuid = user.value.id)
    }
    if (route.params.id === "new" && route.params?.clone) {
        if (Number.isNaN(+route.params?.clone)) {
            currentKP.value = Empty.KP()
            user.value && (currentKP.value.managerUuid = user.value.id)
            return
        }
        currentKP.value = (await get<KP>(+route.params.clone)) || null
        user.value && currentKP.value && (currentKP.value.managerUuid = user.value.id)
        currentKP.value && (currentKP.value.applicationNumber = -1)
    }
    items.value = currentKP.value?.items || [] as KPItem[]
}, {immediate: true})

onBeforeUnmount(() => {
    unwatchRoute()
})
</script>


<style scoped lang="sass">
.bar
    margin-left: auto
    display: flex
    justify-content: flex-end
    gap: 1rem
</style>
