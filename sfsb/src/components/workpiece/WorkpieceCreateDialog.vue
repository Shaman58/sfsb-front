<template>
  <v-dialog v-model="isWorkpieceCreateDialogVisible" width="768">
    <v-form ref="form" v-model="valid" @submit.prevent="save()">
      <v-card>
        <v-card-title>
          <span class="text-h5">Создать заготовку:</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>

              <v-col cols="4">
                <v-select
                  label="Выберите вид:"
                  :items="geometries"
                  item-text="title"
                  item-value="label"
                  v-model="workpiece.geometry"
                  :rules="[rules.required]">
                </v-select>
              </v-col>

              <v-col cols="4">
                <v-select
                  v-if="materials"
                  label="Выберите материал:"
                  :items="materials"
                  :item-title="'materialName'"
                  return-object
                  v-model="workpiece.material"
                  :rules="[rules.required]">
                </v-select>
                <v-text-field
                  label="Цена за килограмм:"
                  v-model="workpiece.price.amount"
                  :rules="[rules.required, rules.numeric, rules.minValidation]"
                  counter
                  numeric>
                </v-text-field>
              </v-col>

              <v-col cols="4" v-if="workpiece.geometry==='BLANK'">
                <v-text-field
                  label="Длина"
                  v-model="workpiece.geom1"
                  :rules="[rules.required, rules.numeric, rules.minValidation]"
                  counter
                  numeric>
                </v-text-field>
                <v-text-field
                  label="Ширина"
                  v-model="workpiece.geom2"
                  :rules="[rules.required, rules.numeric, rules.minValidation]"
                  counter>
                </v-text-field>
                <v-text-field
                  label="Толщина"
                  v-model="workpiece.geom3"
                  :rules="[rules.required, rules.numeric, rules.minValidation]"
                  counter>
                </v-text-field>
              </v-col>

              <v-col cols="4" v-if="workpiece.geometry==='TUBE'">
                <v-text-field
                  label="Внешний диаметр:"
                  v-model="workpiece.geom1"
                  :rules="[rules.required, rules.numeric, rules.minValidation]"
                  counter
                  numeric>
                </v-text-field>
                <v-text-field
                  label="Внутренний диаметр:"
                  v-model="workpiece.geom2"
                  :rules="[rules.required, rules.numeric, rules.minValidation, rules.geom2LessThanGeom1]"
                  counter>
                </v-text-field>
                <v-text-field
                  label="Длина:"
                  v-model="workpiece.geom3"
                  :rules="[rules.required, rules.numeric, rules.minValidation]"
                  counter>
                </v-text-field>
              </v-col>

              <v-col cols="4" v-if="workpiece.geometry==='CYLINDER'">
                <v-text-field
                  label="Диаметр:"
                  v-model="workpiece.geom1"
                  :rules="[rules.required, rules.numeric, rules.minValidation]"
                  counter
                  numeric>
                </v-text-field>
                <v-text-field
                  label="Длина:"
                  v-model="workpiece.geom2"
                  :rules="[rules.required, rules.numeric, rules.minValidation]"
                  counter>
                </v-text-field>
              </v-col>

            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="orange-darken-1" variant="text" @click="hideWorkpieceCreateDialogVisible">
            Закрыть
          </v-btn>
          <v-btn color="orange-darken-1" variant="text" type="submit" :disabled="!valid">
            Сохранить
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>
<script>

import {computed, ref} from "vue";
import {useStore} from "vuex";

export default {
  name: "workpiece-create-dialog",
  setup() {
    const store = useStore();

    const form = ref(null);
    const valid = ref(false);

    const workpiece = computed(() => store.getters.getWorkpiece);
    const materials = computed(() => store.getters.getMaterials);
    const isWorkpieceCreateDialogVisible = computed(() => store.getters.isWorkpieceCreateDialogVisible);
    const hideWorkpieceCreateDialogVisible = () => {
      store.commit("setWorkpieceCreateDialogVisible", false);
    };

    const geometries = ref([
      {title: 'Круг', label: 'CYLINDER'},
      {title: 'Плита', label: 'BLANK'},
      {title: 'Труба', label: 'TUBE'}
    ]);

    const getGeometryLabel = (geometry) => {
      return geometry.label;
    };

    const save = () => {
      if (form.value.validate()) {
        const workpieceData = {
          geometry: workpiece.value.geometry,
          geom1: parseFloat(workpiece.value.geom1),
          geom2: parseFloat(workpiece.value.geom2),
          geom3: parseFloat(workpiece.value.geom3),
          material: workpiece.value.material,
          price: {
            amount: parseFloat(workpiece.value.price.amount),
            currency: 'RUB'
          }
        };
        store.dispatch("saveWorkpiece", workpieceData);
        store.commit("setWorkpieceCreateDialogVisible", false);
      }
    };

    const rules = {
      required: (value) => !!value || "Обязательное поле",
      counter: (value) => value.length <= 200 || "Не более 200 символов",
      numeric: (value) => !isNaN(value) || "Введите число",
      geom2LessThanGeom1: () => {
        if (workpiece.value.geom1 !== null && workpiece.value.geom2 !== null && workpiece.value.geom2 >= workpiece.value.geom1) {
          return "Внутренний диаметр должен быть меньше внешнего диаметра";
        }
        return true;
      },
      minValidation: (value) => value > 0 || "Число должно быть больше 0",
    };

    return {
      hideWorkpieceCreateDialogVisible,
      isWorkpieceCreateDialogVisible,
      form,
      valid,
      save,
      rules,
      workpiece,
      geometries,
      materials,
      getGeometryLabel
    };
  },
};
</script>
