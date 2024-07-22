<template lang="pug">
    v-container.company__container
        suspended-component
            companies-component

</template>

<script setup lang="ts">
import CompaniesComponent from "@/components/company/Companies.vue"
import SuspendedComponent from "@/components/common/SuspendedComponent.vue";
</script>

<style lang="sass" scoped>
.company
    &__container
        width: 100%
        min-height: 100dvh
        display: grid
        place-items: center
</style>
