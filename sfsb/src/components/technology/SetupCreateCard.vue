<template>
  <v-card>
    <v-form ref="form" v-model="valid" @submit.prevent="save()">
      <v-card-title>
        <span class="text-h5">Установка:</span>
      </v-card-title>
      <v-card-text>
        <v-container>

          <v-col cols="5" v-if="setup?.operation?.operationType==='FROM_PROCESS_UNIT'
                   || setup?.operation?.operationType==='FROM_OPERATION_WITH_CALC'">
            <v-switch
              v-model="setup.group"
              :true-value="true"
              :false-value="false"
              :label="setup.group ? 'Групповуха' : 'Одиночная'">
            </v-switch>
          </v-col>

          <v-row>
            <v-col cols="4">
              <v-text-field
                label="Номер установки"
                v-model="setup.setupNumber"
                :rules="[unitNumberValidationRule, rules.required]">
              </v-text-field>
            </v-col>
            <v-col cols="4">
              <v-select
                label="Название установки"
                :items="operations"
                item-title="operationName"
                return-object
                v-model="setup.operation"
                :rules="[rules.required]">
              </v-select>
            </v-col>

            <v-col cols="4"
                   v-if="setup?.operation?.operationType==='FROM_PROCESS_UNIT'
                   || setup?.operation?.operationType==='FROM_OPERATION'
                   ||setup?.operation?.operationType==='FROM_OPERATION_WITH_CALC'">
              <v-text-field
                label="Время цикла(чч:мм)"
                v-model="setup.processTime"
                type="time"
                :rules="[rules.durationNotZeroValidation]"
              ></v-text-field>
            </v-col>
            <v-col cols="4" v-if="setup?.operation?.operationType==='FROM_PROCESS_UNIT'">
              <v-text-field
                label="Межоперационное время(чч:мм)"
                v-model="setup.interoperativeTime"
                type="time"
                :rules="[rules.durationNotZeroValidation]"
              ></v-text-field>
            </v-col>
            <v-col cols="4" v-if="setup?.operation?.operationType==='FROM_PROCESS_UNIT'">
              <v-text-field
                label="Наладочное время(чч:мм)"
                v-model="setup.setupTime"
                type="time"
                :rules="[rules.durationNotZeroValidation]"
              ></v-text-field>
            </v-col>

            <v-col cols="4" v-if="setup?.operation?.operationType==='FROM_OPERATION_WITH_CALC'">
              <v-text-field
                label="Количество за раз"
                v-model="setup.perTime"
                type="number"
                :rules="[rules.numberGreaterThanZero]"
              ></v-text-field>
            </v-col>

            <v-col cols="4" v-if="setup?.operation?.operationType==='FROM_PROCESS_UNIT'">
              <v-select
                :items="units"
                :item-title="'unitName'"
                return-object
                v-model="setup.productionUnit"
                label="Оборудование"
                :rules="[rules.required]">
              </v-select>
            </v-col>

            <v-col cols="4"
                   v-if="setup?.operation?.operationType==='FROM_PROCESS_UNIT'
                   || setup?.operation?.operationType==='FROM_OPERATION'">
              <v-btn v-if="!specialVisible"
                     rounded="lg"
                     tonal
                     class="ml-2" color="orange-darken-1" variant="text"
                     @click="specialVisible=true">
                Специнструмент
              </v-btn>
              <tool-create
                v-else
                title="Специнструмент"
                @hide="specialVisible=false"
                @save="addToSpecials">
              </tool-create>
            </v-col>

            <v-col cols="4"
                   v-if="setup?.operation?.operationType==='FROM_PROCESS_UNIT'
                   || setup?.operation?.operationType==='FROM_OPERATION'">
              <v-btn v-if="!toolingVisible"
                     rounded="lg"
                     tonal
                     class="ml-2" color="orange-darken-1" variant="text"
                     @click="toolingVisible=true">
                Оснастка
              </v-btn>
              <tool-create
                v-else
                title="Оснастка"
                @hide="toolingVisible=false"
                @save="addToToolings">
              </tool-create>
            </v-col>

            <v-col cols="4"
                   v-if="setup?.operation?.operationType==='FROM_PROCESS_UNIT'
                   || setup?.operation?.operationType==='FROM_OPERATION'">
              <v-btn v-if="!measureVisible"
                     rounded="lg"
                     tonal
                     class="ml-2" color="orange-darken-1" variant="text"
                     @click="measureVisible=true">
                Меритель
              </v-btn>
              <tool-create
                v-else
                title="Меритель"
                @hide="measureVisible=false"
                @save="addToMeasures">
              </tool-create>
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
  </v-card>
</template>

<script setup>
import {ref, reactive, computed} from 'vue';
import {useStore} from 'vuex';
import ToolCreate from "@/components/technology/ToolCreate.vue";
import {useValidationRules} from "@/mixins/FieldValidationRules";

const props = defineProps({
  setup: {
    type: Object,
    default: {
      id: 0,
      perTime: 0,
      measureTools: [],
      specialTools: [],
      toolings: [],
      additionalTools: [],
      operation: {operationType: ''}
    },
  }
});
const emit = defineEmits();
const setup = reactive(props.setup);
const store = useStore();
const {rules} = useValidationRules();
const valid = ref(false);
const form = ref(null);
const measureVisible = ref(false);
const toolingVisible = ref(false);
const specialVisible = ref(false);

const units = computed(() => store.getters.getUnits);
const cutters = computed(() => store.getters.getCutters);
const measurers = computed(() => store.getters.getMeasurers);
const specials = computed(() => store.getters.getSpecials);
const toolings = computed(() => store.getters.getToolings);
const setupNumbers = computed(() => store.getters.getSetups.filter(item => item.id !== setup.id).map(obj => obj.setupNumber));
const operations = computed(() => store.getters.getOperations);
const unitNumberValidationRule = rules.unitNumberValidation(setupNumbers);

const save = async () => {
  if (setup?.operation?.operationType === 'FROM_OPERATION_WITH_CALC'
    || setup?.operation?.operationType === 'FROM_OPERATION') {
    await store.dispatch("saveSetup", {
      ...setup,
      interoperativeTime: '00:00',
      setupTime: '00:00',
      productionUnit: null
    });
  } else {
    await store.dispatch("saveSetup", setup);
  }
  hideSetup();
};

const deleteSetup = () => {
  emit("deleteSetup");
};

const hideSetup = () => {
  emit("hideSetup");
}

const addToMeasures = (tool) => {
  setup.measureTools.push(tool);
};

const addToToolings = (tool) => {
  setup.toolings.push(tool);
};

const addToSpecials = (tool) => {
  setup.specialTools.push(tool);
};

</script>
