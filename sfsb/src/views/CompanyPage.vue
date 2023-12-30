<template lang="pug">
v-container.company__container
    Suspense
        template(v-slot:fallback)
            v-progress-circular(indeterminate :size="62" :width="6" color="orange")
        Company

</template>

<script setup lang="ts">
import Company from "@/components/company/Company"
</script>

<style lang="sass" scoped>
.company
    &__container
        width: 100%
        min-height: 100dvh
        display: grid
        place-items: center
</style>
