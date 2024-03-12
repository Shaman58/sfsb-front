<template lang="pug">
    LayoutMain
        template(#header)
            v-progress-linear(indeterminate v-if="loading")
            v-card(width="100%")
                v-card-actions
                    .bar
                        v-icon(icon="mdi:mdi-content-copy")
                        v-icon(icon="mdi:mdi-floppy" @click="saveKP")
                        v-icon(icon="mdi:mdi-delete")
        template(#default v-if="currentKP" )
            div(v-if="manager") Автор: {{manager && (manager.firstName + " " + manager.lastName)}}
            v-row
                v-col(lg="4")
                    span Номер:
                    span {{currentKP.applicationNumber}}
                v-col(lg="4")
                    span Создан:
                    span {{new Date(currentKP.created).toLocaleDateString() + " " + new Date(currentKP.created).toLocaleTimeString()}}
                v-col(lg="4" v-if="currentKP.updated" )
                    span Обновлен:
                    span {{new Date(currentKP.updated).toLocaleDateString() + " " + new Date(currentKP.updated).toLocaleTimeString()}}
            v-row
                v-col
                    v-select(:items="companies.map(e=>e.companyName)" :model-value="company.companyName || companies[0].companyName" label="От: " @update:modelValue="changeCompany")
                v-col()
                    v-select(:items="customers.map(e=>e.companyName)" label="Для: ")
            v-row
                v-col(col="12")
                    v-textarea(v-model="currentKP.businessProposal" label="Оферта" )
            v-text-field(
                v-model="search"
                label="Фильтр"
                prepend-inner-icon="mdi-magnify"
                variant="outlined"
                hide-details
                single-line
            )
            suspended-component
                KPItemsList(v-model:items="items" :search)

                //template(v-slot:item.name="{ item }") {{item.name}}


</template>

<script setup lang="ts">

import {useRoute} from "vue-router";
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

const route = useRoute()
const {loading} = storeToRefs(useKPStore())
const {get, save} = useKPStore()

const currentKP: Ref<KP | null> = ref(null)
const items = ref<KPItem[]>([])


const search = ref("")

//--- MANAGER ---
const {staff} = storeToRefs(useStaffStore())
const {getAllStaff} = useStaffStore()
!staff.value.length && await getAllStaff()

const manager = computed<Person | undefined>(() => {
    const res = staff.value.find(e => e.id === currentKP.value?.managerUuid)
    return res
})

//--- COMPANY ---
const {companies} = storeToRefs(useCompaniesStore())
const {fetchCompaniesData} = useCompaniesStore()
!companies.value.length && await fetchCompaniesData()

const company = computed<Company | undefined>(()=>companies.value.find(e => e.id === currentKP.value?.companyId))

//--- CUSTOMERS ---
const {customers} = storeToRefs(useCustomersStore())
const {fetchCustomers} = useCustomersStore()
!customers.value.length && await fetchCustomers()

// const customer = computed<Company|undefined>(()=>customers.value.find(e=>e.id===currentKP.value?.customerId))

const saveKP=async()=> {
    const updated = currentKP.value?.updated || ""
    const created = currentKP.value?.created || ""
    const businessProposal = currentKP.value?.businessProposal || ""
    const applicationNumber = currentKP.value?.applicationNumber || 0
    const companyId = currentKP.value?.companyId || 0
    const managerUuid = currentKP.value?.managerUuid || ""
    await save({...currentKP.value,
        updated,
        created,
        businessProposal,
        applicationNumber,
        companyId,
        managerUuid,
        items: items.value})
}

const changeCompany=(ev: string)=>{
    const foundCompany = companies.value.find(e=>e.companyName===ev)
    currentKP.value && (currentKP.value.companyId = foundCompany ? +foundCompany.id : 0)
}
//--- WATCH ---
const unwatchRoute = watch([route], async () => {
    if (!Number.isNaN(Number(+route.params.id))) {
        currentKP.value = (await get<KP>(+route.params.id)) || null
    }
    if (route.params.id === "new") {
        currentKP.value = Empty.KP()
        currentKP.value.items = [Empty.KPItem()]
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
