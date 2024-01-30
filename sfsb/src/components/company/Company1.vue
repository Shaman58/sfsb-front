<template lang="pug">
    .company
        suspended-component
            CompanyCard
</template>

<script setup lang="ts">

import CompanyCard from "@/components/company/CompanyCard.vue";
import SuspendedComponent from "@/components/common/SuspendedComponent.vue";
</script>

<style scoped lang="sass">
.company
    min-height: calc(100dvh - 40px)
    width: 100%
    display: grid
    place-items: center
</style>
