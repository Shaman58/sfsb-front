<template lang="pug">
    suspended-component
        //DataPageTabs
        router-view
</template>
<script setup lang="ts">

import SuspendedComponent from "@/components/common/SuspendedComponent.vue";
import DataPageTabs from "@/views/DataPageTabs.vue";
import {useRoute, useRouter} from "vue-router";
import {toRefs} from "vue";

const router = useRouter();
const {path} = toRefs(useRoute())
const defaultRoute = "/data/materials";

path.value.split("/").at(-1) === 'data' && router.push(defaultRoute)
</script>

