<template>
  <v-card class="mx-auto" max-width="400">
    <v-list dense @click="showMainDialog">
      <v-list-subheader>Управление персоналом</v-list-subheader>
      <v-list-item
        v-for="item in demoDepartments"
        :key="item.id"
        :value="item"
        color="primary"
      >
        <v-list-item-title>{{ item.departmentName }}</v-list-item-title>
      </v-list-item>
      <v-list-item>
        <v-list-item-title>...</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-card>
</template>
<script>
import {computed} from "vue";
import {useStore} from "vuex";

export default {
  name: "department-preview-card",
  setup() {
    const store = useStore();

    const demoDepartments = computed(() => store.getters.getDemoDepartments);

    const showMainDialog = () => {
      store.commit("setMainDialog", true);
    };

    return {
      demoDepartments,
      showMainDialog,
    };
  },
};
</script>
