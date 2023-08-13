<template>
  <v-dialog v-model="isMeasureDialogVisible" width="768">
    <v-form ref="form" v-model="valid" @submit.prevent="save()">
      <v-card>
        <v-card-title>
          <span class="text-h5">Меритель:</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="4">
                <v-select
                  v-if="availableMeasurers"
                  label="Выберите меритель:"
                  :items="availableMeasurers"
                  :item-title="'toolName'"
                  return-object
                  v-model="mapItem.measureTool"
                  :rules="[rules.required]"
                  @update:modelValue="createNewMeasure"
                  :disabled="isMeasureDialogFromItem"
                ></v-select>
              </v-col>
              <v-col cols="4">
                <v-text-field
                  label="Количество:"
                  v-model="mapItem.amount"
                  :rules="[rules.required, rules.minNumbersValidation]"
                  counter
                  maxlength="40"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="orange-darken-1" variant="text" @click="hideMeasureCreateDialog">
            Закрыть
          </v-btn>
          <v-btn color="orange-darken-1" variant="text" type="submit" :disabled="!valid">
            Сохранить
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
  <measure-tool-create-dialog/>
</template>
<script>
import {computed, ref} from "vue";
import {useStore} from "vuex";
import MeasureToolCreateDialog from "@/components/measure/MeasureToolCreateDialog.vue";

export default {
  name: "measure-tool-list-item-dialog",
  components: {MeasureToolCreateDialog},

  mounted() {
    this.$store.dispatch("fetchMeasurers");
  },
  setup() {
    const store = useStore();

    const form = ref(null);
    const valid = ref(false);

    const isMeasureDialogVisible = computed(() => store.getters.isMeasureDialogVisible);
    const isMeasureDialogFromItem = computed(() => store.getters.isMeasureDialogFromItem);
    const mapItem = computed(() => store.getters.getMapItem);
    const selectedStore = computed(() => store.getters.getSelectedStore);
    const selectedArea = computed(() => store.getters.getSelectedArea);
    const measurers = computed(() => store.getters.getMeasurers);

    const rules = {
      required: (value) => !!value || "Обязательное поле",
      minNumbersValidation: value => {
        const pattern = /^[0-9]{1,5}$/
        return pattern.test(value) || 'Неверный формат, введите 1-5 цифр'
      },
    };

    const availableMeasurers = computed(() => {
      const selectedMeasureIds = selectedStore.value.measureTools.map((measure) => measure.measureTool.id);

      const createToolOption = {
        id: undefined,
        toolName: 'Создать меритель',
        description: ''
      };

      return [
        ...measurers.value.filter((measure) => !selectedMeasureIds.includes(measure.id)),
        createToolOption
      ];
    });

    const save = () => {
      if (form.value.validate()) {
        store.commit("updateMeasureInStore", mapItem.value);
        store.dispatch("saveStore", {store: selectedStore.value, area: selectedArea.value});
        hideMeasureCreateDialog();
      }
    };

    const hideMeasureCreateDialog = () => {
      store.commit("setMeasureDialogVisible", false);
    };

    const createNewMeasure = () => {
      if (!!!mapItem.value.measureTool.id) {
        store.commit("setMeasureCreateDialogVisible", true)
      }
    };

    return {
      isMeasureDialogVisible,
      hideMeasureCreateDialog,
      mapItem,
      save,
      valid,
      form,
      rules,
      measurers,
      availableMeasurers,
      createNewMeasure,
      isMeasureDialogFromItem
    };
  },
};
</script>
