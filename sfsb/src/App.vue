<template>
  <v-app>
    <navbar/>
    <router-view/>
  </v-app>
</template>

<script setup>
import Navbar from "@/components/Navbar.vue";
</script>


<style lang="sass">
.v-toolbar__content
  height: 32px !important
</style>
