<template lang="pug">
    LayoutPage.users(:background="'#7757e069'")
        template(#title) Календари
        template(#filter)
            v-text-field(label="фильтр" v-model="filterText" clearable)
        template(#list)
            suspended-component
                //technology-list(:filter="filterText")
        template(#card)
            //suspended-component
            //    router-view
            <v-date-picker></v-date-picker>
</template>

<script setup lang="ts">

import SuspendedComponent from "@/components/common/SuspendedComponent.vue";
import LayoutPage from "@/components/common/LayoutPage.vue";
import {ref} from "vue";

const filterText = ref("");
</script>


<style scoped lang="sass">

</style>
