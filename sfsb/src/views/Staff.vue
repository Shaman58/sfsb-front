<template lang="pug">
v-container
    Suspense
        template(v-slot:fallback) Загружаем список пользователей ...
        template(v-slot:default)
            staff-list
                template(v-slot:title)
                    h1 Управление пользователями
</template>

<script setup lang="ts">
import StaffList from "@/components/staff/StaffList.vue"
</script>

<style lang="sass" scoped>

</style>
