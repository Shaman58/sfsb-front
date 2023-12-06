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

      </v-toolbar-items>
    </v-app-bar>
  </v-container>
</template>

<script setup>
import {ref} from "vue";
import ImpulsHub from "@/components/ImpulsHub.vue";
import CONSTS from "@/consts"

;

const version = ref(import.meta.env.VITE_APP_VERSION);

</script>

<style lang="sass">
.navbar
  padding: 4px
</style>
