<template lang="pug">
    suspended-component
        router-view
</template>

<script setup lang="ts">
import SuspendedComponent from "@/components/common/SuspendedComponent.vue";
import {toRefs} from "vue";
import {useRoute, useRouter} from "vue-router";

const router = useRouter();
const {path} = toRefs(useRoute())
const defaultRoute = "/commerce/orders";

path.value.split("/").at(-1) === 'commerce' && router.push(defaultRoute)
</script>
