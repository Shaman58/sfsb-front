<template lang="pug">
//<company-component/>
.start-page
    Suspense
        template(#fallback)
            v-progress-circular(indeterminate :size="62" :width="6" color="#2F477E")
        template(#default)
            Companies

</template>

<script setup lang="ts">
import CompanyComponent from "@/components/company/CompanyComponent.vue";
import Companies from "@/components/company/Companies.vue";
</script>

<style scoped lang="sass">
.start-page
    height: calc(100dvh - 40px)
    display: grid
    place-items: center
</style>
