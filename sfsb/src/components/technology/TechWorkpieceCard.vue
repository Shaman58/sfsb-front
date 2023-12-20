<template>
  <v-card>
    <v-form ref="form" v-model="valid" @submit.prevent="save()">
      <v-card-title>
        <span v-if="workpiece.geometry" class="text-h5">Изменить заготовку:</span>
        <span v-else class="text-h5">Создать заготовку:</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>

            <v-col cols="4">
              <v-select label="Выберите вид:"
                        :items="geometries"
                        item-text="title"
                        item-value="label"
                        v-model="geometry"
                        clearable
              >
              </v-select>
              <v-text-field label="Фильтр:"
                            v-model="materialFilter">
              </v-text-field>
            </v-col>

            <v-col cols="4">
              <v-select
                v-if="materials"
                label="Выберите материал:"
                :items="filteredMaterials"
                :item-title="formatObjectData"
                return-object
                v-model="workpiece.material"
                :rules="[rules.required]">
                <template v-slot:item="{ props, item }">
                  <v-list-item v-bind="props" :subtitle="item.raw.gost2"></v-list-item>
                </template>
              </v-select>
            </v-col>

            <v-col cols="4"
                   v-if="
                   workpiece?.material?.geometry==='BLANK' ||
                   workpiece?.material?.geometry==='TAPE' ||
                   workpiece?.material?.geometry==='LIST' ||
                   workpiece?.material?.geometry==='OTHER'">
              <v-text-field label="Длина"
                            v-model="workpiece.geom1"
                            :rules="[rules.required, rules.numeric, rules.minValidation]"
                            counter
                            numeric>
              </v-text-field>
              <v-text-field label="Ширина"
                            v-model="workpiece.geom2"
                            :rules="[rules.required, rules.numeric, rules.minValidation]"
                            counter>
              </v-text-field>
              <v-text-field label="Толщина"
                            v-model="workpiece.geom3"
                            :rules="[rules.required, rules.numeric, rules.minValidation]"
                            counter>
              </v-text-field>
            </v-col>

            <v-col cols="4"
                   v-if="workpiece?.material?.geometry==='TUBE'">
              <v-text-field label="Внешний диаметр:"
                            v-model="workpiece.geom1"
                            :rules="[rules.required, rules.numeric, rules.minValidation]"
                            counter
                            numeric>
              </v-text-field>
              <v-text-field label="Внутренний диаметр:"
                            v-model="workpiece.geom2"
                            :rules="[rules.required, rules.numeric, rules.minValidation, geom2LessThanGeom1]"
                            counter>
              </v-text-field>
              <v-text-field label="Длина:"
                            v-model="workpiece.geom3"
                            :rules="[rules.required, rules.numeric, rules.minValidation]"
                            counter>
              </v-text-field>
            </v-col>

            <v-col cols="4"
                   v-if="
                   workpiece?.material?.geometry==='CYLINDER' ||
                   workpiece?.material?.geometry==='HEXAGON'||
                   workpiece?.material?.geometry==='ROD'">
              <v-text-field label="Диаметр:"
                            v-model="workpiece.geom1"
                            :rules="[rules.required, rules.numeric, rules.minValidation]"
                            counter
                            numeric>
              </v-text-field>
              <v-text-field label="Длина:"
                            v-model="workpiece.geom2"
                            :rules="[rules.required, rules.numeric, rules.minValidation]"
                            counter>
              </v-text-field>
            </v-col>

            <v-col cols="4"
                   v-if="workpiece?.material?.geometry==='SQUARE'">
              <v-text-field label="Сторона:"
                            v-model="workpiece.geom1"
                            :rules="[rules.required, rules.numeric, rules.minValidation]"
                            counter
                            numeric>
              </v-text-field>
              <v-text-field label="Длина:"
                            v-model="workpiece.geom2"
                            :rules="[rules.required, rules.numeric, rules.minValidation]"
                            counter>
              </v-text-field>
            </v-col>

            <v-col cols="4" v-if="workpiece?.material?.geometry==='PROFILE'">
              <v-text-field label="Длина:"
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
import {ref, getCurrentInstance, reactive, computed, watch} from 'vue';
import materialDataFormatting from '@/mixins/MaterialDataFormatting'
import {useValidationRules} from "@/mixins/FieldValidationRules";
import CONSTS from '@/consts';
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
const geometry = ref(null);
const materialFilter = ref(null);
const {emit} = getCurrentInstance();
// const {geometries} = materialDataFormatting();
const geometries = CONSTS.GEOMETRIES
const {rules} = useValidationRules();
const geom2LessThanGeom1 = rules.geom2LessThanGeom1(workpiece);
// ---- ФУНКЦИИ ----
const save = () => {
  if (form.value.validate()) {
    const validWorkpiece = {
      ...workpiece,
      geom1: parseFloat(workpiece.geom1),
      geom2: parseFloat(workpiece.geom2),
      geom3: parseFloat(workpiece.geom3),
      material: workpiece.material,
    };
    validatedWorkpiece(validWorkpiece);
    hide();
  }
};

const formatObjectData = (data) => {
  const {materialName, gost1} = data;
  return `${materialName} ${gost1}`;
};

const filteredMaterials = computed(() => {
  return props.materials.filter((item) => {
    return (
      (!geometry.value || item.geometry === geometry.value) &&
      (!materialFilter.value || item.materialName.toLowerCase().includes(materialFilter.value.toLowerCase()) ||
        item.gost1.toLowerCase().includes(materialFilter.value.toLowerCase())||
        item.gost2.toLowerCase().includes(materialFilter.value.toLowerCase()))
    );
  });
});

const hide = () => emit('hide');
const validatedWorkpiece = (validWorkpiece) => emit('validatedWorkpiece', validWorkpiece);

watch(geometry, () => {
  workpiece.material = null;
});

</script>
