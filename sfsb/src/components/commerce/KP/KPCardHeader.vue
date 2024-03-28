<template lang="pug">
    div.pb-4 Автор: {{manager ? manager.firstName + " " + manager.lastName : "Не указан"}}
    v-row
        v-col.py-0(lg="4")
            v-text-field(v-model="applicationNumber" label="Номер:" )
        v-col.py-0(lg="4")
            span Создан:
            span {{new Date(created).toLocaleDateString() + " " + new Date(created).toLocaleTimeString()}}
        v-col.py-0(lg="4" v-if="updated" )
            span Обновлен:
            span {{new Date(updated).toLocaleDateString() + " " + new Date(updated).toLocaleTimeString()}}
    v-row
        v-col.py-0
            v-select(
                :items="companies.map(e=>e.companyName)"
                :model-value="company?.companyName || companies[0].companyName"
                label="От: "
                @update:modelValue="changeCompany"
            )
        v-col.py-0
            v-select(
                :items="customers.map(e=>e.companyName)"
                :model-value="customer?.companyName || customers[0].companyName"
                label="Для: "
                @update:modelValue="changeCustomer"
            )
    v-row
        v-col.py-0(col="12")
            v-text-field(v-model="businessProposal" label="Оферта" )
</template>

<script setup lang="ts">
import {storeToRefs} from "pinia";
import {useCompaniesStore} from "@/pinia-store/companies";
import {computed, toRefs, watchEffect} from "vue";
import {useStaffStore} from "@/pinia-store/staff";
import {useCustomersStore} from "@/pinia-store/customers";

const props = defineProps<{ managerUuid: string, created: string | null, updated: string | null }>()
const {managerUuid, updated, created} = toRefs(props)
const emit = defineEmits(["changeBusinessProposal"])

const applicationNumber = defineModel("applicationNumber")
const businessProposal = defineModel("businessProposal")
const companyId = defineModel("companyId")
const customerId = defineModel("customerId")

//--- MANAGER ---
const {staff} = storeToRefs(useStaffStore())
const {getAllStaff} = useStaffStore()
!staff.value.length && await getAllStaff()

const manager = computed<Person | undefined>(() => staff.value.find(e => e.id === managerUuid.value))


//--- COMPANY ---
const {companies} = storeToRefs(useCompaniesStore())
const {fetchCompaniesData} = useCompaniesStore()
!companies.value.length && await fetchCompaniesData()

const company = computed<Company | undefined>(() => companies.value.find(e => e.id === companyId.value))

//--- CUSTOMERS ---
const {customers} = storeToRefs(useCustomersStore())
const {fetchCustomers} = useCustomersStore()
!customers.value.length && await fetchCustomers()

const customer = computed<Customer | undefined>(() => customers.value.find(e => e.id === customerId.value))

// const customer = computed<Company|undefined>(()=>customers.value.find(e=>e.id===currentKP.value?.customerId))
const changeCompany = (ev: string) => {
    const changedCompany = companies.value.find(e => e.companyName === ev)
    companyId.value = changedCompany?.id
}
const changeCustomer = (ev: string) => {
    const changedCustomer = customers.value.find(e => e.companyName === ev)
    customerId.value = changedCustomer?.id
}

watchEffect(() => {
    console.log(companyId.value)
})

</script>

<style scoped lang="sass">

</style>
