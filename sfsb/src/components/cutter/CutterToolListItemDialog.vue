<template>
  <v-dialog v-model="isCutterDialogVisible" width="768">
    <v-form ref="form" v-model="valid" @submit.prevent="save()">
      <v-card>
        <v-card-title>
          <span class="text-h5">Инструмент:</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="4">
                <v-select
                  v-if="availableCutters"
                  label="Выберите инструмент:"
                  :items="availableCutters"
                  :item-title="'toolName'"
                  return-object
                  v-model="mapItem.cutterTool"
                  :rules="[rules.required]"
                  @update:modelValue="createNewCutter"
                  :disabled="isCutterDialogFromItem"
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
          <v-btn color="orange-darken-1" variant="text" @click="hideCutterCreateDialog">
            Закрыть
          </v-btn>
          <v-btn color="orange-darken-1" variant="text" type="submit" :disabled="!valid">
            Сохранить
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
  <cutter-tool-create-dialog/>
</template>
<script>
import {computed, ref} from "vue";
import {useStore} from "vuex";
import CutterToolCreateDialog from "@/components/cutter/CutterToolCreateDialog.vue";

export default {
  name: "cutter-tool-list-item-dialog",
  components: {CutterToolCreateDialog},
  mounted() {
    this.$store.dispatch("fetchCutters");
  },
  setup() {
    const store = useStore();

    const form = ref(null);
    const valid = ref(false);

    const isCutterDialogVisible = computed(() => store.getters.isCutterDialogVisible);
    const isCutterDialogFromItem = computed(() => store.getters.isCutterDialogFromItem);
    const mapItem = computed(() => store.getters.getMapItem);
    const selectedStore = computed(() => store.getters.getSelectedStore);
    const selectedArea = computed(() => store.getters.getSelectedArea);
    const cutters = computed(() => store.getters.getCutters);

    const rules = {
      required: (value) => !!value || "Обязательное поле",
      minNumbersValidation: value => {
        const pattern = /^[0-9]{1,5}$/
        return pattern.test(value) || 'Неверный формат, введите 1-5 цифр'
      },
    };

    const availableCutters = computed(() => {
      const selectedCutterIds = selectedStore.value.cutterTools.map((cutter) => cutter.cutterTool.id);

      const createToolOption = {
        id: undefined,
        toolName: 'Создать инструмент',
        description: ''
      };

      return [
        ...cutters.value.filter((cutter) => !selectedCutterIds.includes(cutter.id)),
        createToolOption
      ];
    });

    const save = () => {
      if (form.value.validate()) {
        store.commit("updateCutterInStore", mapItem.value);
        store.dispatch("saveStore", {store: selectedStore.value, area: selectedArea.value});
        hideCutterCreateDialog();
      }
    };

    const hideCutterCreateDialog = () => {
      store.commit("setCutterDialogVisible", false);
    };

    const createNewCutter = () => {
      if (!!!mapItem.value.cutterTool.id) {
        store.commit("setCutterCreateDialogVisible", true)
      }
    };

    return {
      isCutterDialogVisible,
      hideCutterCreateDialog,
      mapItem,
      save,
      valid,
      form,
      rules,
      cutters,
      availableCutters,
      createNewCutter,
      isCutterDialogFromItem
    };
  },
};
</script>
