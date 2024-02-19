<template lang="pug">
    LayoutPage.users(:background="'#BB00C120'")
        template(#title) {{ $route.meta.name }}
        template(#filter)
            v-text-field(label="фильтр" v-model="filterText" clearable)
        template(#list)
            suspended-component
                users-list(:filter="filterText")
        template(#card)
            suspended-component
                router-view
</template>
<script setup lang="ts">
import LayoutPage from "@/components/common/LayoutPage.vue";
import UsersList from "@/components/users/UsersList.vue";
import SuspendedComponent from "@/components/common/SuspendedComponent.vue";
import {ref} from "vue";

const filterText = ref("")
</script>
<style scoped lang="sass">

</style>
