<template>
  <v-card>
    <v-form ref="form" v-model="valid" @submit.prevent="save()">
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
        <v-btn color="orange-darken-1" variant="text" @click="hide">
          Закрыть
        </v-btn>
        <v-btn color="orange-darken-1" variant="text" type="submit" :disabled="!valid">
          Сохранить
        </v-btn>
      </v-card-actions>
    </v-form>
  </v-card>
</template>

<script setup>
import {defineProps, ref, getCurrentInstance, reactive} from 'vue';

// ---- ПРОПСЫ ----
const props = defineProps({
  workpiece: {
    type: Object,
    default: {},
  },
  materials: Array,
});
const workpiece = reactive(props.workpiece);

// ---- ССЫЛКИ И СОСТОЯНИЯ ----
const form = ref(null);
const valid = ref(false);
const {emit} = getCurrentInstance();
const geometries = ref([
  {title: 'Круг', label: 'CYLINDER'},
  {title: 'Плита', label: 'BLANK'},
  {title: 'Труба', label: 'TUBE'}
]);

// ---- ФУНКЦИИ ----
const save = () => {
  if (form.value.validate()) {
    const validWorkpiece = {
      geometry: workpiece.geometry,
      geom1: parseFloat(workpiece.geom1),
      geom2: parseFloat(workpiece.geom2),
      geom3: parseFloat(workpiece.geom3),
      material: workpiece.material,
    };
    validatedWorkpiece(validWorkpiece);
    hide();
  }
};

const hide = () => emit('hide');
const validatedWorkpiece = (validWorkpiece) => emit('validatedWorkpiece', validWorkpiece);

// ---- ПРАВИЛА ВАЛИДАЦИИ ----
const rules = {
  required: (value) => !!value || "Обязательное поле",
  counter: (value) => value.length <= 200 || "Не более 200 символов",
  numeric: (value) => !isNaN(value) || "Введите число",
  geom2LessThanGeom1: () => {
    if (workpiece.geom1 !== null && workpiece.geom2 !== null && parseFloat(workpiece.geom2) >= parseFloat(workpiece.geom1)) {
      return "Внутренний диаметр должен быть меньше внешнего диаметра";
    }
    return true;
  },
  minValidation: (value) => value > 0 || "Число должно быть больше 0",
};
</script>
