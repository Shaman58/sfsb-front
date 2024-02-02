<template lang="pug">
    LayoutPage
        template(#title) Клиенты
        template(#filter)
            v-text-field(label="фильтр" v-model="filterText")
        template(#list)
            v-list
                v-list-item(v-for="i in customers" @click="currentCompany=i"
                    :key="i.id" :active="currentCompany.id===i.id") {{i.companyName}}
        template(#card)
            ClientCard(:company="currentCompany" :loading)

</template>
<script setup lang="ts">
import {storeToRefs} from "pinia";
import {useCustomersStore} from "@/pinia-store/customers";
import {ref, watchEffect} from "vue";
import LayoutPage from "@/components/common/LayoutPage.vue";
import ClientCard from "@/components/commerce/ClientCard.vue";

const {customers, loading} = storeToRefs(useCustomersStore())
const {fetchCustomers} = useCustomersStore()
!customers.value.length && await fetchCustomers()

const filterText = ref("")
const currentCompany = ref<Customer>(customers.value[0])

watchEffect(() => console.log(currentCompany.value))
</script>
<style scoped lang="sass">

</style>
