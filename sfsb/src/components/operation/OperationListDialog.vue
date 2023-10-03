<template>
  <v-dialog v-model="isVisible" persistent>
    <v-card>
      <v-card-title>
        <v-row>
          <v-col cols="4">
            <v-text-field
              label="Фильтр:"
              v-model="filter">
            </v-text-field>
          </v-col>
          <v-col>
            <v-btn
              color="orange-lighten-1"
              variant="text"
              @click.stop="showDialog(setupPrice)">Наладочная
            </v-btn>
          </v-col>
          <v-col>
            <v-btn
              color="orange-lighten-1"
              variant="text"
              @click.stop="showDialog(techPrice)">Технолог
            </v-btn>
          </v-col>
        </v-row>
      </v-card-title>
      <v-list>
        <v-list-item
          v-for="item in filtered"
          :key="item.id"
          :title="item.operationName"
          :subtitle="formatOperationData(item.operationTimeManagement)"
          @click.stop="showDialog(item)">

          <template v-slot:append>
            <v-btn
              color="orange-lighten-1"
              icon="mdi-delete"
              variant="text"
              @click.stop="remove(item)"
            ></v-btn>
          </template>

        </v-list-item>

        <v-list-item :title="'...'">

          <template v-slot:append>
            <v-btn
              color="orange-lighten-1"
              icon="mdi-plus"
              variant="text"
              @click.stop="showDialog({paymentPerHour:{currency:'RUB'}})"
            ></v-btn>
          </template>

        </v-list-item>
      </v-list>

      <v-card-actions>
        <v-spacer/>
        <v-btn
          color="orange-darken-1"
          variant="text"
          @click="hide">
          Закрыть
        </v-btn>
      </v-card-actions>

    </v-card>
  </v-dialog>
</template>

<script setup>
import {computed, ref} from "vue";
import {useStore} from "vuex";
import useOperationFormatting from "@/mixins/OperationDataFormatting"

const {formatOperationData} = useOperationFormatting();

const store = useStore();

const filter = ref(null);

const isVisible = computed(() => store.getters.getOperationListVisible);
const operations = computed(() => store.getters.getOperations);
const techPrice = computed(() => store.getters.getTechPrice);
const setupPrice = computed(() => store.getters.getSetupPrice);

const remove = ((item) => {
  store.dispatch("deleteOperation", item);
});

const hide = (() => {
  store.commit("setOperationListVisible", false)
});

const showDialog = ((item) => {
  store.commit("setOperation", {...item});
  store.commit("setOperationDialogVisible", true);
});

const filtered = computed(() => {
  return operations.value.filter((item) => {
    return (
      (!filter.value || item.operationName.toLowerCase().includes(filter.value.toLowerCase()))
    );
  });
});

</script>
