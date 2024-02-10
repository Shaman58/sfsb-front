<template lang="pug">
LayoutPage.supply(:background="'linear-gradient(45deg, #bbb, #efefef)'")
    template(#title) Снабжение
    template(#list)
        v-list
            v-list-item(@click="()=>{}" v-for="i in supplyMap(useSupplyStore)" :key="i.title" :active="i.path===path")
                router-link.list-link(:to="i.path") {{ i.title }}

    template(#card)
        suspended-component
            router-view
</template>
<script setup lang="ts">

import SuspendedComponent from "@/components/common/SuspendedComponent.vue"
import { toRefs } from "vue";
import LayoutPage from "@/components/common/LayoutPage.vue";
import supplyMap from "./SupplyMap";
import { useSupplyStore } from "@/pinia-store/supply";
import { useRoute, useRouter } from "vue-router";

const router = useRouter()
const { path } = toRefs(useRoute())
const defaultRoute = "/supplier/all";

path.value.split("/").at(-1) === 'supplier' && router.push(defaultRoute)

</script>
<style scoped lang="sass">

</style>
