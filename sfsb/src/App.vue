<template>
    <v-app>
        <navbar />
        <router-view />
    </v-app>
</template>

<script setup lang="ts">
import Navbar from "@/components/Navbar.vue";
import { useTheme } from "vuetify";
import { onMounted } from "vue";


</script>


<style lang="sass">
.v-toolbar__content
  height: 32px !important

[untouchable="true"]
  pointer-events: none
  // filter: contrast(0)
  opacity: 0.5
  user-select: none
</style>
