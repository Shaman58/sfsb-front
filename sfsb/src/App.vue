<template>
    <v-app>
        <navbar />
        <router-view />
    </v-app>
</template>

<script setup lang="ts">
import Navbar from "@/components/Navbar.vue";
import { useCurrentUserStore } from "@/pinia-store/currentUser";


</script>


<style lang="sass">
.v-toolbar__content
  height: 32px !important
[untouchable]
    pointer-events: none
    filter: contrast(0)
    user-select: none
</style>
