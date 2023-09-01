<template>
  <v-card class="mx-auto" max-width="1000">
    <v-container>

      <v-toolbar color="white">
        <v-toolbar-title>Производственные мощности</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn variant="text"
               color="orange-lighten-1"
               icon="mdi-plus"
               @click="showCreateAreaDialog()">
        </v-btn>
      </v-toolbar>

      <v-row>
        <v-col cols="6"
               v-for="area in areas"
               :key="area.id"
               :value="area"
               @click="showAreaDialog(area)">
          <v-card class="mx-auto" max-width="500"
                  :title="area.areaName">
            <v-list>
              <v-list-subheader>
                {{ area.units ? `Оборудование (${area.units.length}ед.)` : 'Оборудование' }}
              </v-list-subheader>
              <v-list-item
                v-for="unit in getLimitedUnits(area.units)"
                :key="unit.id"
                :title="unit.unitName"
              >
                Стоимость в час: {{ unit.paymentPerHour.formatted }}
              </v-list-item>
            </v-list>

<!--            <v-list>-->
<!--              <v-list-subheader>{{ area.stores ? `Склады (${area.stores.length})` : 'Склады' }}</v-list-subheader>-->
<!--              <v-list-item-->
<!--                v-for="store in getLimitedStores(area.stores)"-->
<!--                :key="store.id"-->
<!--                :title="store.storeName">-->
<!--              </v-list-item>-->
<!--            </v-list>-->
          </v-card>
        </v-col>
      </v-row>

    </v-container>
  </v-card>
</template>

<script>
import {useStore} from "vuex";
import {computed} from "vue";

export default {
  name: "area-preview-card",
  setup() {
    const store = useStore();

    const areas = computed(() => store.getters.getAreas);

    const getLimitedUnits = (units) => {
      if (units && Array.isArray(units)) {
        return units.slice(0, 2);
      }
      return [];
    };

    const getLimitedStores = (stores) => {
      if (stores && Array.isArray(stores)) {
        return stores.slice(0, 2);
      }
      return [];
    };

    const showAreaDialog = (area) => {
      store.commit("setArea", area);
      store.commit("setAreaDialog", true);
    };

    const showCreateAreaDialog = () => {
      store.commit("setArea", {});
      store.commit("setCreateAreaDialog", true);
    };

    return {
      areas,
      showAreaDialog,
      getLimitedUnits,
      showCreateAreaDialog,
      getLimitedStores
    };
  },
}
</script>
