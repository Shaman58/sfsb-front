<template lang="pug">
    LayoutPage.supply(:background="'#ccc'")
        template(#title) Снабжение
        template(#list)
            v-list
                v-list-item(@click="()=>{}" v-for="i in supplyMap(useSupplyStore)" :key="i.title")
                    router-link.list-link(:to="i.path") {{ i.title }}

        template(#card)
            suspended-component
                router-view
</template>
<script setup lang="ts">

import SuspendedComponent from "@/components/common/SuspendedComponent.vue"
import {ref} from "vue";
import LayoutPage from "@/components/common/LayoutPage.vue";
import supplyMap from "./SupplyMap";
import {useSupplyStore} from "@/pinia-store/supply";

const filterText = ref("")
</script>
<style scoped lang="sass">

</style>
