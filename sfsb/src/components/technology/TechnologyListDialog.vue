<template>
  <v-card>
    <v-card-title>
      <span class="text-h5">Технологии</span>
    </v-card-title>
    <v-list density="compact">
      <v-list-item
        v-for="item in employeeTechnologies"
        :key="item.id"
        :value="item"
        :title="`${item.drawingName} ${item.drawingNumber}`"
        @click="showTechnologyCreateDialog({...item})">
      </v-list-item>
    </v-list>
  </v-card>
</template>

<script>
import {computed} from "vue";
import {useStore} from "vuex";

export default {
  name: "technology-list-dialog",
  setup() {
    const store = useStore();

    const technologist = computed(() => store.getters.getEmployee);
    const technologies = computed(() => store.getters.getTechnologies);
    const employeeTechnologies = computed(() => !!technologist.value ? technologies.value.filter(tech => tech.employee.id === technologist.value.id) : []);

    const showTechnologyCreateDialog = (technology) => {
      store.commit("setTechnology", technology);
      store.commit("setSetups", technology.setups);
      store.commit("setTechnologyDialogVisible", true);
    }

    return {
      employeeTechnologies,
      showTechnologyCreateDialog
    };
  },
};
</script>
