<template>
  <v-list density="compact">
    <v-list-item v-for="unit in area.units" :key="unit.id" :value="unit">
      <v-list-item-title @click="selectUnit(unit)">
        <v-list-subheader>№ {{ unit.unitNumber }}</v-list-subheader>
        {{ unit.unitName }}
      </v-list-item-title>
      <template v-slot:append>
        <v-btn
          color="orange-lighten-1"
          icon="mdi-delete"
          variant="text"
          @click="deleteUnit(unit)"
        ></v-btn>
      </template>
    </v-list-item>
    <v-list-item>
      <v-list-item-title>
        ...
      </v-list-item-title>
      <template v-slot:append>
        <v-btn
          color="orange-lighten-1"
          icon="mdi-plus"
          variant="text"
          @click="selectUnit({price:{},paymentPerHour:{}, unitNumber: calculateUnitNumber})"
        ></v-btn>
      </template>
    </v-list-item>
  </v-list>
</template>

<script>
import {useStore} from "vuex";
import {computed} from "vue";

export default {
  name: "unit-list-card",
  setup() {
    const store = useStore();

    const area = computed(() => store.getters.getSelectedArea);

    const deleteUnit = (unit) => {
      store.dispatch("deleteUnit", unit);
    };

    const selectUnit = (unit) => {
      store.commit("setSelectedUnit", {...unit});
      store.commit("setUnitCreateDialog", true);
    };

    const calculateUnitNumber = computed(() => {
      const unitNumbers = area.value.units.map(obj => obj.unitNumber);
      for (let i = 1; i <= Number.MAX_SAFE_INTEGER; i++) {
        if (!unitNumbers.includes(i)) {
          return i;
        }
      }
      return -1
    });

    return {
      area,
      deleteUnit,
      selectUnit,
      calculateUnitNumber
    };
  },
}
</script>
