<template>
  <v-select
    :items="employees"
    :item-title="'firstName'"
    return-object
    v-model="employee"
    @update:model-value="setTechnologist(employee)"
    label="Технолог">
  </v-select>
</template>

<script>

import {useStore} from "vuex";
import {computed, ref} from "vue";

export default {
  name: "technologist-select",
  setup() {
    const store = useStore();

    const employees = computed(() => store.getters.getEmployees);
    const employee = ref(null);

    const setTechnologist = (employee) => {
      store.commit("setEmployee", employee);
    }

    return {
      employees,
      employee,
      setTechnologist
    }
  }
}
</script>
