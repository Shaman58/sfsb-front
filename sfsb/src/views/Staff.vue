<template lang="pug">
v-container.staff__container
    Suspense
        template(v-slot:fallback)
            v-progress-circular(indeterminate :size="62" :width="6" color="orange")
        template(v-slot:default)
            staff-list
                template(v-slot:title)
                    h1 Управление пользователями
</template>

<script setup lang="ts">
import StaffList from "@/components/staff/StaffList.vue"
</script>

<style lang="sass" scoped>
.staff__container
    height: 100%
    display: grid
    place-items: center

</style>
