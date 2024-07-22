<template lang="pug">
    LayoutPage
        template(#title) Клиенты
        template(#filter)
            v-text-field(label="фильтр" v-model="filterText" clearable)
        template(#list)
            v-list
                v-list-item
                    v-list-item-title
                        router-link.list-link(:to="`/commerce/clients/new`")
                            div(:style="{color: 'orange'}") Добавить новую компанию
                v-list-item(
                    v-for="i in filteredCustomers"
                    @click="currentCompany=i"
                    @keyup.space="console.log('keyup space',i);currentCompany=i"
                    :key="i.id"
                    :active="+page===i.id"
                )
                    v-list-item-title
                        router-link.list-link(:to="`/commerce/clients/${i.id}`") {{i.companyName}}
        template(#card)
            router-view

</template>
<script setup lang="ts">
import {storeToRefs} from "pinia";
import {useCustomersStore} from "@/pinia-store/customers";
import {computed, onMounted, ref, toRefs, watch} from "vue";
import LayoutPage from "@/components/common/LayoutPage.vue";
import {useRoute, useRouter} from "vue-router";

const router = useRouter()

const route = useRoute();
const {path} = toRefs(route);
const page = computed(() => path.value.split("/").at(-1))

const {customers, loading} = storeToRefs(useCustomersStore())
const {fetchCustomers} = useCustomersStore()
!customers.value.length && await fetchCustomers()

const firstId = computed(() => customers.value[0].id)
page.value === "clients" && router.push(`/commerce/clients/${firstId.value}`)

const filterText = ref("")
const filteredCustomers = computed<Customer[]>(() => customers.value.filter(e => e.companyName.toLowerCase().includes(filterText.value?.toLowerCase() || "")))
const currentCompany = ref<Customer>(customers.value[0])

onMounted(() => {
    if (!route.params.id) {
        router.push(`/commerce/clients/${firstId.value}`)
    }
})
watch([route], () => {
    if (!route.params.id) {
        router.push(`/commerce/clients/${firstId.value}`)
    }
}, {immediate: true})

</script>
<style scoped lang="sass">

</style>
