<template lang="pug">
v-container.staff__container
    Suspense
        template(v-slot:fallback)
            v-progress-circular(indeterminate :size="62" :width="6" color="#2196F3")
        template(v-slot:default)
            supply-list
                template(v-slot:title)
                    h1 Управление пользователями
</template>

<script setup lang="ts">
import SupplyList from "@/components/supply/SupplyList.vue"
</script>

<style lang="sass" scoped>
.staff__container
    height: 100%
    display: grid
    place-items: center

</style>
