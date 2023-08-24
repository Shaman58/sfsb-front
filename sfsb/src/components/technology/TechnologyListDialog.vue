<template>
  <v-container>
    <v-card v-if="isComputedVisible">
      <v-card-title>
        <span class="text-h5">Технологии на просчет:</span>
      </v-card-title>
      <v-list density="compact">
        <v-list-item
          v-for="item in employeeItemsComputed"
          :key="item.id"
          :value="item"
          :title="`${item.technology.drawingName} ${item.technology.drawingNumber}`"
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
          v-for="item in employeeItemsNotComputed"
          :key="item.id"
          :value="item"
          :title="`${item.technology.drawingName} ${item.technology.drawingNumber}`"
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

    const items = computed(() => store.getters.getItems);
    const employeeItemsComputed = computed(() => items.value.filter(item => item.technology.computed !== true));
    const employeeItemsNotComputed = computed(() => items.value.filter(item => item.technology.computed === true));
    const isComputedVisible = computed(() => employeeItemsComputed.value.length !== 0);
    const isNotComputedVisible = computed(() => employeeItemsNotComputed.value.length !== 0);

    const showTechnologyCreateDialog = (item) => {
      store.commit("setItem", item);
      store.commit("setSetups", item.technology.setups);
      store.commit("setTechnologyDialogVisible", true);
    }

    return {
      showTechnologyCreateDialog,
      isComputedVisible,
      isNotComputedVisible,
      employeeItemsComputed,
      employeeItemsNotComputed,
    };
  },
};
</script>
