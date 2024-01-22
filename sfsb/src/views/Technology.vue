<template lang="pug">
    suspended-component.technology-view
        technology-dialog
</template>

<script setup lang="ts">
import TechnologyDialog from '@/components/technology/TechnologyDialog.vue';
import SuspendedComponent from "@/components/common/SuspendedComponent.vue";
</script>
<style lang="sass" scoped>
.technology-view
    height: calc(100dvh - 40px)
    display: grid
    place-items: center
</style>
