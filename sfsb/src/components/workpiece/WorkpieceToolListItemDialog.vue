<template>
  <v-dialog v-model="isWorkpieceDialogVisible" width="768">
    <v-form ref="form" v-model="valid" @submit.prevent="save()">
      <v-card>
        <v-card-title>
          <span class="text-h5">Заготовка:</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="4">
                <v-select
                  v-if="availableWorkpieces"
                  label="Выберите заготовку:"
                  :items="availableWorkpieces"
                  :item-title="formatObjectData"
                  return-object
                  v-model="mapItem.workpiece"
                  :rules="[rules.required]"
                  @update:modelValue="createNewWorkpiece"
                  :disabled="isWorkpieceDialogFromItem">
                </v-select>
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
          <v-btn color="orange-darken-1" variant="text" @click="hideWorkpieceCreateDialog">
            Закрыть
          </v-btn>
          <v-btn color="orange-darken-1" variant="text" type="submit" :disabled="!valid">
            Сохранить
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
  <workpiece-create-dialog/>
</template>
<script>
import {computed, ref} from "vue";
import {useStore} from "vuex";
import WorkpieceCreateDialog from "@/components/workpiece/WorkpieceCreateDialog.vue";

export default {
  name: "workpiece-list-item-dialog",
  components: {WorkpieceCreateDialog},

  mounted() {
    this.$store.dispatch("fetchSpecials");
  },
  setup() {
    const store = useStore();

    const form = ref(null);
    const valid = ref(false);

    const isWorkpieceDialogVisible = computed(() => store.getters.isWorkpieceDialogVisible);
    const isWorkpieceDialogFromItem = computed(() => store.getters.isWorkpieceDialogFromItem);
    const mapItem = computed(() => store.getters.getMapItem);
    const selectedStore = computed(() => store.getters.getSelectedStore);
    const selectedArea = computed(() => store.getters.getSelectedArea);
    const workpieces = computed(() => store.getters.getWorkpieces);

    const rules = {
      required: (value) => !!value || "Обязательное поле",
      minNumbersValidation: value => {
        const pattern = /^[0-9]{1,5}$/
        return pattern.test(value) || 'Неверный формат, введите 1-5 цифр'
      },
    };

    const availableWorkpieces = computed(() => {
      const selectedWorkpiecesIds = selectedStore.value.workpieces.map((workpiece) => workpiece.workpiece.id);

      const createToolOption = {
        id: undefined,
        message: 'Создать заготовку',
      };

      return [
        createToolOption,
        ...workpieces.value.filter((workpiece) => !selectedWorkpiecesIds.includes(workpiece.id)),
      ];
    });

    const save = () => {
      if (form.value.validate()) {
        store.commit("updateWorkpieceInStore", mapItem.value);
        store.dispatch("saveStore", {store: selectedStore.value, area: selectedArea.value});
        hideWorkpieceCreateDialog();
      }
    };

    const hideWorkpieceCreateDialog = () => {
      store.commit("setWorkpieceDialogVisible", false);
    };

    const createNewWorkpiece = () => {
      if (!!!mapItem.value.workpiece.id) {
        store.commit("setWorkpieceCreateDialogVisible", true)
      }
    };

    const formatObjectData = (data) => {
      if (!!data.id) {
        const {geometry, geom1, geom2, geom3, material: {materialName}} = data;

        let shape = '';
        let dimensions = '';

        switch (geometry) {
          case 'CYLINDER':
            shape = 'Круг';
            dimensions = `Ф${geom1}х${geom2}`;
            break;
          case 'TUBE':
            shape = 'Труба';
            dimensions = `Ф${geom1}ф${geom2}х${geom3}`;
            break;
          case 'BLANK':
            shape = 'Плита';
            dimensions = `${geom1}х${geom2}х${geom3}`;
            break;
          default:
            break;
        }

        return `${shape} ${materialName} ${dimensions}`;
      } else {
        return data.message;
      }
    };

    return {
      isWorkpieceDialogVisible,
      hideWorkpieceCreateDialog,
      mapItem,
      save,
      valid,
      form,
      rules,
      workpieces,
      availableWorkpieces,
      createNewWorkpiece,
      isWorkpieceDialogFromItem,
      formatObjectData
    };
  },
};
</script>
