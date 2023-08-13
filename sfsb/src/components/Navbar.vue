<template>
  <v-container class="pa-4">
    <v-app-bar color="orange" density="compact" title="SFSB">
      <template v-slot:prepend>
        <v-app-bar-nav-icon/>
      </template>

      <v-toolbar-items class="ml-5">

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

<script>
import {ref} from "vue";

export default {
  name: "navbar",
  setup() {

    const navItems = ref([
      {path: "/", label: "Данные"},
      {path: "/commerce", label: "Комерция"},
      {path: "/technology", label: "Технология"}
    ]);

    return {
      navItems,
    };

  }
};
</script>
