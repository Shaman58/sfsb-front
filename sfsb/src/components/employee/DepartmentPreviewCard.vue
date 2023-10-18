<template>
  <v-card class="mx-auto" max-width="400">
    <v-list dense>
      <v-list-subheader>Управление персоналом</v-list-subheader>
      <v-list-item
        v-for="(item, index) in departments"
        :key="index"
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
<script setup>
import {ref} from "vue";
import {useStore} from "vuex";

const props = defineProps({
  departments: {
    type: Array,
    required: true
  }
});

const store = useStore();

const departments = ref(props.departments);

</script>
