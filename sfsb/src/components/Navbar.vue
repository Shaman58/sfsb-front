<template>
  <v-container>
    <v-app-bar color="orange" class="navbar">
      <template v-slot:prepend>
        <impuls-hub/>
      </template>
      <div class="navbar__user-data">
          <img class="navbar__img" :src="picture" alt="avatar"/>
          <span class="navbar__name">{{ name }}</span>
      </div>
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

<script setup lang="ts">
import {ref, onMounted} from "vue";
import ImpulsHub from "@/components/ImpulsHub.vue";
import CONSTS from "@consts"
import keycloakService from '@/plugins/keycloak/service';
import { useToast } from "vue-toast-notification";

const toast = useToast();

const version = import.meta.env.VITE_APP_VERSION;

const logout = ( ) => keycloakService.logout()

const name = ref();
const picture = ref()

onMounted(async ()=>{
    const user = await keycloakService.keycloak.loadUserProfile()
    picture.value = import.meta.env.VITE_APP_BASE_FS_URL + user.attributes.picture[0]
    name.value = user.firstName + " " + user.lastName
})
</script>

<style lang="sass" >
.navbar
    padding: 4px

    &__logout
        background: #fff

    &__user-data
        display: flex
        align-items: center
        gap: 0.5rem
        margin-right: 1.5rem

    &__img
        width: 30px
        height: 30px
        border-radius: 50%
        object-fit: cover

</style>
