<template>
  <v-container>
    <v-app-bar color="orange" class="navbar">
      <template v-slot:prepend>
        <impuls-hub/>
      </template>
      {{ version }}
      <v-toolbar-items class="ml-5" style="overflow-x: auto;">

        <v-btn
          v-for="item in CONSTS.MAINMENU"
          :key="item.path"
          :to="item.path"
          rounded="xs"
          tonal
          >
          {{ item.label }}
        </v-btn>
        <v-btn class="navbar__logout"  elevation="4" icon="mdi-exit-to-app" title="выход" @click="logout"></v-btn>
      </v-toolbar-items>
    </v-app-bar>
  </v-container>
</template>

<script setup>
import {ref} from "vue";
import ImpulsHub from "@/components/ImpulsHub.vue";
import CONSTS from "@/consts"
import keycloakService from '@/plugins/keycloak/service';

const version = import.meta.env.VITE_APP_VERSION;

const logout = ( ) => keycloakService.logout()

</script>

<style lang="sass" >
.navbar
    padding: 4px

    &__logout
        background: #fff
</style>
