<template>
  <v-card>
    <v-form ref="form" v-model="valid" @submit.prevent="save()">
      <v-card-title>
        <span class="text-h5">Установка:</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="4">
              <v-text-field
                label="Номер установки"
                v-model="setup.setupNumber"
                :rules="[rules.unitNumberValidation, rules.required]">
              </v-text-field>
            </v-col>
            <v-col cols="4">
              <v-text-field
                label="Название установки"
                v-model="setup.setupName"
                :rules="[rules.nameValidation, rules.required, rules.counter]">
              </v-text-field>
            </v-col>
            <v-col cols="4">
              <v-text-field
                label="Машинное время(чч:мм)"
                v-model="setup.processTime"
                type="time"
                :rules="[rules.durationNotZeroValidation]"
              ></v-text-field>
            </v-col>
            <v-col cols="4">
              <v-text-field
                label="Межоперационное время(чч:мм)"
                v-model="setup.interoperativeTime"
                type="time"
                :rules="[rules.durationNotZeroValidation]"
              ></v-text-field>
            </v-col>
            <v-col cols="4">
              <v-text-field
                label="Наладочное время(чч:мм)"
                v-model="setup.setupTime"
                type="time"
                :rules="[rules.durationNotZeroValidation]"
              ></v-text-field>
            </v-col>
            <v-col cols="4">
              <v-select
                :items="units"
                :item-title="'unitName'"
                return-object
                v-model="setup.productionUnit"
                label="Оборудование"
                :rules="[rules.required]">
              </v-select>
            </v-col>
            <v-col cols="12">
              <v-select
                chips
                label="Инструмент"
                :items="[...cutters, {id:'new',toolName: 'Создать инструмент'}]"
                :item-title="'toolName'"
                return-object
                v-model="setup.cutterTools"
                @update:modelValue="createNewCutter"
                multiple
              ></v-select>
            </v-col>
            <v-col cols="12">
              <v-select
                chips
                label="Меритель"
                :items="[...measurers, {id:'new', toolName: 'Создать меритель'}]"
                :item-title="'toolName'"
                return-object
                v-model="setup.measureTools"
                @update:modelValue="createNewMeasure"
                multiple
              ></v-select>
            </v-col>
            <v-col cols="12">
              <v-select
                chips
                label="Специнструмент"
                :items="[...specials, {id:'new', toolName: 'Создать специнструмент'}]"
                :item-title="'toolName'"
                return-object
                v-model="setup.specialTools"
                @update:modelValue="createNewSpecial"
                multiple
              ></v-select>
            </v-col>
            <v-col cols="12">
              <v-select
                chips
                label="Оснастка"
                :items="[...toolings, {id:'new', toolingName: 'Создать оснастку'}]"
                :item-title="'toolingName'"
                return-object
                v-model="setup.toolings"
                @update:modelValue="createNewTooling"
                multiple
              ></v-select>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-btn color="orange-darken-1" variant="text" @click="deleteSetup" v-if="!!setup.id">
          Удалить
        </v-btn>
        <v-btn color="orange-darken-1" variant="text" @click="hideSetup">
          Закрыть
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn color="orange-darken-1" variant="text" type="submit" :disabled="!valid">
          Сохранить
        </v-btn>
      </v-card-actions>
    </v-form>
    <cutter-tool-create-dialog/>
    <measure-tool-create-dialog/>
    <tooling-create-dialog/>
    <special-create-dialog/>
  </v-card>
</template>

<script>
import {computed, reactive, ref} from "vue";
import {useStore} from "vuex";
import CutterToolCreateDialog from "@/components/cutter/CutterToolCreateDialog.vue";
import MeasureToolCreateDialog from "@/components/measure/MeasureToolCreateDialog.vue";
import ToolingCreateDialog from "@/components/tooling/ToolingCreateDialog.vue";
import SpecialCreateDialog from "@/components/special/SpecialCreateDialog.vue";
import WorkpieceCreateDialog from "@/components/workpiece/WorkpieceCreateDialog.vue";

export default {
  components: {
    WorkpieceCreateDialog,
    SpecialCreateDialog, ToolingCreateDialog, MeasureToolCreateDialog, CutterToolCreateDialog
  },
  props: {
    setup: {
      type: Object,
      required: true,
    },
  },
  name: "setup-create-card",
  setup(props, context) {
    const store = useStore();

    const valid = ref(false);
    const form = ref(null);
    const setup = reactive(props.setup);
    const units = computed(() => store.getters.getUnits);
    const cutters = computed(() => store.getters.getCutters);
    const measurers = computed(() => store.getters.getMeasurers);
    const specials = computed(() => store.getters.getSpecials);
    const toolings = computed(() => store.getters.getToolings);
    const setupNumbers = computed(() => store.getters.getSetups.filter(item => item.id !== setup.id).map(obj => obj.setupNumber));

    const save = () => {
      store.dispatch("saveSetup", setup);
      hideSetup();
    };

    const deleteSetup = () => {
      context.emit("deleteSetup");
    };

    const hideSetup = () => {
      context.emit("hideSetup");
    };

    const rules = {
      required: (value) => !!value || "Обязательное поле",
      counter: (value) => value.length <= 200 || "Не более 200 символов",
      nameValidation: (value) => value.length >= 3 || "Минимальное количество символов: 3",
      unitNumberValidation: value => {
        const pattern = /^[0-9]{1,5}$/
        const isUnique = !setupNumbers.value.includes(Number(value))
        return pattern.test(value) && isUnique || 'Неверный формат или число уже присутствует в массиве'
      },
      durationNotZeroValidation: value => value !== '00:00' || 'Продолжительность не должна быть равна "00:00"'
    };

    const createNewCutter = () => {
      const index = setup.cutterTools.findIndex(item => item.id === 'new');
      if (index !== -1) {
        setup.cutterTools.splice(index, 1);
        store.commit("setCutter", {price: {}});
        store.commit("setCutterCreateDialogVisible", true);
      }
    };

    const createNewMeasure = () => {
      const index = setup.measureTools.findIndex(item => item.id === 'new');
      if (index !== -1) {
        setup.measureTools.splice(index, 1);
        store.commit("setMeasure", {price: {}});
        store.commit("setMeasureCreateDialogVisible", true);
      }
    };

    const createNewSpecial = () => {
      const index = setup.specialTools.findIndex(item => item.id === 'new');
      if (index !== -1) {
        setup.specialTools.splice(index, 1);
        store.commit("setSpecial", {price: {}});
        store.commit("setSpecialCreateDialogVisible", true);
      }
    };

    const createNewTooling = () => {
      const index = setup.toolings.findIndex(item => item.id === 'new');
      if (index !== -1) {
        setup.toolings.splice(index, 1);
        store.commit("setTooling", {price: {}});
        store.commit("setToolingCreateDialogVisible", true);
      }
    };

    return {
      setup,
      valid,
      form,
      save,
      deleteSetup,
      hideSetup,
      rules,
      units,
      cutters,
      toolings,
      measurers,
      specials,
      createNewCutter,
      createNewMeasure,
      createNewTooling,
      createNewSpecial
    }
  }
}
</script>
