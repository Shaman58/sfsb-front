<template lang="pug">
v-container.companies
    .companies__container
        router-link(v-for="company in companies||[]" :to="'/company/'+company.id")
            CompanyPreviewCard(:company="company" )
        router-link( :to="'/company/new'")
            v-card(class="mx-auto companies__new" max-width="344" variant="outlined")
                v-card-item СОЗДАТЬ НОВУЮ КОМПАНИЮ
</template>

<script setup lang="ts">

import CompanyPreviewCard from "@/components/company/CompanyPreviewCard.vue";
import {useCompaniesStore} from "@/pinia-store/companies"
import {storeToRefs} from "pinia";

const {companies} = storeToRefs(useCompaniesStore())
const {fetchCompaniesData} = useCompaniesStore()
await fetchCompaniesData()
</script>


<style scoped lang="sass">
.companies
    display: grid
    height: calc(100dvh - 40px)
    place-items: center

    &__container
        width: 100%
        display: grid
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr))
        gap: 2rem

        & > * > .v-card
            height: 100%

    &__new
        padding: 1rem
        height: 100%
        display: grid
        place-items: center

</style>
