<template lang="pug">
    LayoutPage.users(:background="'#00bfa520'")
        template(#title) Технологии
        template(#filter)
            v-text-field(label="фильтр" v-model="filterText" clearable)
        template(#list)
            suspended-component
                technology-list(:filter="filterText")
        template(#card)
            suspended-component
                router-view
</template>
<script setup lang="ts">
import LayoutPage from "@/components/common/LayoutPage.vue";
import SuspendedComponent from "@/components/common/SuspendedComponent.vue";
import {ref} from "vue";
import TechnologyList from "@/components/technology-new/TechnologyList.vue";

const filterText = ref("")
</script>
<style scoped lang="sass">

</style>

