<template lang="pug">
v-container
    staff-list
        template(v-slot:title)
            h1 Управление пользователями
</template>

<script setup lang="ts">
import StaffList from "@/components/staff/StaffList.vue"
</script>

<style lang="sass" scoped>

</style>
