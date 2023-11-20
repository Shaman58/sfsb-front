<template>
  <v-container class="pa-4">
    <v-app-bar color="orange">
      <template v-slot:prepend>
        <impuls-hub/>
      </template>
      {{ version }}
      <v-toolbar-items class="ml-5" style="overflow-x: auto;">

        <v-btn
          v-for="item in navItems"
          :key="item.path"
          :to="item.path"
          rounded="lg"
          tonal
          class="ml-2">
          {{ item.label }}
        </v-btn>

      </v-toolbar-items>
    </v-app-bar>
  </v-container>
</template>

<script setup>
import {ref} from "vue";
import ImpulsHub from "@/components/ImpulsHub.vue";

const navItems = ref([
  {path: "/", label: "Данные"},
  {path: "/commerce", label: "Комерция"},
  {path: "/technology", label: "Технология"}
]);

const version = ref(import.meta.env.VITE_APP_VERSION);

</script>
