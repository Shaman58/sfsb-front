<template lang="pug">
    LayoutMain
        template(#header)
            v-progress-linear(indeterminate v-if="loading")
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
                v-col(v-if="company")
                    v-select(:items="companies.map(e=>e.companyName)" :model-value="company.companyName" label="От: " )
                v-col()
                    v-select(:items="customers.map(e=>e.companyName)" label="Для: ")
            v-row
                v-col(col="12")
                    v-textarea(:model-value="currentKP.businessProposal" auto-grow label="Оферта")
            v-text-field(
                v-model="search"
                label="Фильтр"
                prepend-inner-icon="mdi-magnify"
                variant="outlined"
                hide-details
                single-line
            )
            v-data-table(:items :headers :search)
                template(#item="{item}" )
                    tr
                        td
                            .controls
                                v-icon(icon="mdi:mdi-close" :color="'red'")
                                v-icon(icon="mdi:mdi-pen" )
                        td {{item.decimal}}
                        td {{item.name}}
                        td {{new Date(item.created).toLocaleDateString()}}
                        td {{item.updated}}
                        td {{item.itemPrice}}
                        td {{item.amount}}
                        td {{item.totalPrice}}

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

const route = useRoute()
const {loading} = storeToRefs(useKPStore())
const {get} = useKPStore()

const currentKP: Ref<KP | null> = ref(null)
const items = ref<KPItem[]>([])
const headers = [
    {key: "controls", title: "Управление"},
    {key: "decimal", title: "Децимальный номер"},
    {key: "name", title: "Наименование"},
    {key: "created", title: "Создан"},
    {key: "updated", title: "Обновлен"},
    {key: "price", title: "Прайс"},
    {key: "amount", title: "Количество"},
    {key: "total", title: "Итого"}
]

const search = ref("")

//--- MANAGER ---
const {staff} = storeToRefs(useStaffStore())
const {getAllStaff} = useStaffStore()
!staff.value.length && await getAllStaff()

const manager = computed<Person|undefined>(()=> {
    const res  = staff.value.find(e => e.id === currentKP.value?.managerUuid)
    return res
})

//--- COMPANY ---
const {companies} = storeToRefs(useCompaniesStore())
const {fetchCompaniesData} = useCompaniesStore()
!companies.value.length && await fetchCompaniesData()

const company = computed<Company|undefined>(()=>companies.value.find(e=>e.id===currentKP.value?.companyId))

//--- CUSTOMERS ---
const {customers} = storeToRefs(useCustomersStore())
const {fetchCustomers} = useCustomersStore()
!customers.value.length && await fetchCustomers()

// const customer = computed<Company|undefined>(()=>customers.value.find(e=>e.id===currentKP.value?.customerId))

//--- WATCH ---
const unwatchRoute = watch([route], async () => {
    if (!Number.isNaN(Number(+route.params.id))) {
        currentKP.value = (await get<KP>(+route.params.id)) || null
    }
    if(route.params.id==="new"){
        currentKP.value = Empty.KP()
    }
    items.value = currentKP.value?.items || [] as KPItem[]
}, {immediate: true})

onBeforeUnmount(() => {
    unwatchRoute()
})
</script>


<style scoped lang="sass">

</style>
