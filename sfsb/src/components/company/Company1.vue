<template lang="pug">
.company
    Suspense
        template(#fallback)
            v-progress-circular(indeterminate :size="62" :width="6" color="#2F477E")
        template(#default)
            CompanyCard
</template>

<script setup lang="ts">

import CompanyCard from "@/components/company/CompanyCard.vue";
</script>

<style scoped lang="sass">
.company
    min-height: calc(100dvh - 40px)
    width: 100%
    display: grid
    place-items: center
</style>
