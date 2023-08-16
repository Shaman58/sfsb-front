<template>
  <v-container>
    <v-card v-if="isComputedVisible">
      <v-card-title>
        <span class="text-h5">Технологии на просчет:</span>
      </v-card-title>
      <v-list density="compact">
        <v-list-item
          v-for="item in employeeTechnologiesComputed"
          :key="item.id"
          :value="item"
          :title="`${item.drawingName} ${item.drawingNumber}`"
          @click="showTechnologyCreateDialog({...item})">
        </v-list-item>
      </v-list>
    </v-card>
    <div v-if="isComputedVisible&&isNotComputedVisible">
      <br/>
      <v-divider/>
      <br/>
    </div>
    <v-card v-if="isNotComputedVisible">
      <v-card-title>
        <span class="text-h5">Просчитанные технологии:</span>
      </v-card-title>
      <v-list density="compact">
        <v-list-item
          v-for="item in employeeTechnologiesNotComputed"
          :key="item.id"
          :value="item"
          :title="`${item.drawingName} ${item.drawingNumber}`"
          @click="showTechnologyCreateDialog({...item})">
        </v-list-item>
      </v-list>
    </v-card>
  </v-container>
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
    const items = computed(() => store.getters.getItems);
    const employeeItems = computed(() => !!technologist.value ? items.value.filter(item => item.technology.employee.id === technologist.value.id) : []);
    const employeeItemsComputed = computed(() => employeeItems.value.filter(item => item.technology.computed !== true));
    const employeeItemsNotComputed = computed(() => employeeItems.value.filter(item => item.technology.computed === true));
    const employeeTechnologies = computed(() => !!technologist.value ? technologies.value.filter(tech => tech.employee.id === technologist.value.id) : []);
    const employeeTechnologiesComputed = computed(() => employeeTechnologies.value.filter(tech => tech.computed !== true));
    const employeeTechnologiesNotComputed = computed(() => employeeTechnologies.value.filter(tech => tech.computed === true));
    const isComputedVisible = computed(() => employeeTechnologiesComputed.value.length !== 0);
    const isNotComputedVisible = computed(() => employeeTechnologiesNotComputed.value.length !== 0);

    const showTechnologyCreateDialog = (technology) => {
      store.commit("setTechnology", technology);
      store.commit("setSetups", technology.setups);
      store.commit("setTechnologyDialogVisible", true);
    }

    return {
      employeeTechnologiesComputed,
      employeeTechnologiesNotComputed,
      showTechnologyCreateDialog,
      isComputedVisible,
      isNotComputedVisible
    };
  },
};
</script>
