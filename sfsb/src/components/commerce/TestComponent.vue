<script setup lang="ts">
import {useRoute} from "vue-router";
import {toRefs} from "vue";

const {params} = toRefs(useRoute())

</script>

<template>
    <br>
    <h1>{{ params.id }}</h1>
    <br>
</template>

<style scoped lang="sass">

</style>
