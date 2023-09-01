<template>
  <v-container fluid>
    <v-dialog v-model="isDialogVisible" fullscreen>
      <v-form ref="form" v-model="valid" @submit.prevent="save()">
        <v-card class="dialog-content">
          <v-card-title>
            <span class="text-h5">{{ item.technology.drawingNumber + " " + item.technology.drawingName }}</span>
          </v-card-title>
          <v-card-text>

            <v-row>
              <v-col>
                <v-card
                  width="200"
                  v-if="!workpieceCardVisible"
                  title="Заготовка:"
                  @click="showWorkpieceCard">
                  <v-card-item>
                    {{
                      !!item.technology.workpiece ? formatObjectData(item.technology.workpiece.material) : "Задать заготовку"
                    }}
                  </v-card-item>
                </v-card>
                <tech-workpiece-card
                  v-else
                  :workpiece="{...item.technology.workpiece}"
                  :materials="materials"
                  @validatedWorkpiece="saveWorkpiece"
                  @hide="hideWorkpieceCard"
                />
              </v-col>
              <v-col cols="3" v-if="!workpieceCardVisible">
                <v-text-field
                  label="Из заготовки"
                  v-model="item.technology.quantityOfPartsFromWorkpiece"
                  type="number"
                  :rules="[rules.required,rules.numeric, rules.minValidation]"
                />
              </v-col>
              <v-col cols="3" v-if="!workpieceCardVisible">
                <v-text-field
                  label="Наладочных"
                  v-model="item.technology.quantityOfSetUpParts"
                  type="number"
                  :rules="[rules.required,rules.numeric, rules.minValidation]"
                />
              </v-col>
              <v-col cols="3" v-if="!workpieceCardVisible">
                <v-text-field
                  label="На брак"
                  v-model="item.technology.quantityOfDefectiveParts"
                  type="number"
                  :rules="[rules.required,rules.numeric, rules.minValidation]"
                />
              </v-col>

            </v-row>
            <v-row justify="end">
              <v-btn color="orange-darken-1" variant="text" type="submit"
                     :disabled="!valid || !item.technology.workpiece">
                Сохранить данные заготовки
              </v-btn>
            </v-row>
            <br/>
            <v-divider/>
            <br/>

            <v-row>
              <v-col cols="8">
                <v-row>

                  <v-col cols="12" v-for="(setup, index) in setups" :key="index">
                    <v-card v-if="!(setup.isVisible)" @click="setup.isVisible = true">
                      <v-card-title>
                        <a>
                          {{ "№" + setup.setupNumber + " " + setup.operation.operationName }}
                          <v-spacer>
                            <a>{{ setup.productionUnit?.unitName }}</a>
                          </v-spacer>
                        </a>
                      </v-card-title>
                      <v-card-item>
                        {{ compactInfo(setup) }}
                      </v-card-item>
                    </v-card>
                    <setup-create-card
                      v-else
                      :setup="{...setup, technology: item.technology}"
                      :items-from-workpiece="Number(item.technology.quantityOfPartsFromWorkpiece)"
                      @hideSetup="hideSetup(setup)"
                      @deleteSetup="deleteSetup(setup)"/>
                  </v-col>

                  <v-col cols="12">
                    <v-card
                      title="Новый установ"
                      v-if="!newSetup.isVisible"
                      @click="newSetup.isVisible = true">
                    </v-card>
                    <setup-create-card
                      v-else
                      :setup="{...newSetup, setupNumber: calculateSetupNumber}"
                      @hideSetup="hideSetup(newSetup)"/>
                  </v-col>

                </v-row>
              </v-col>

              <v-col cols="4">
                <v-card title="Расходники:">
                  <v-card-item v-if="techSpecials.length!==0">
                    Специнструмент:
                    <v-list>
                      <v-list-item
                        v-for="item in techSpecials"
                        :key="item.id"
                        :title="item.toolName +'   '+ item.amount"/>
                    </v-list>
                  </v-card-item>
                  <v-card-item v-if="techMeasurers.length!==0">
                    Mеритель:
                    <v-list>
                      <v-list-item
                        v-for="item in techMeasurers"
                        :key="item.id"
                        :title="item.toolName"/>
                    </v-list>
                  </v-card-item>
                  <v-card-item v-if="techToolings.length!==0">
                    Оснастка:
                    <v-list>
                      <v-list-item
                        v-for="item in techToolings"
                        :key="item.id"
                        :title="item.toolName"/>
                    </v-list>
                  </v-card-item>
                </v-card>
              </v-col>
            </v-row>

          </v-card-text>
          <v-card-actions>
            <v-col cols="2">
              <a>
                {{ item.technology.computed ? 'Рассчитан' : 'Не рассчитан' }}
              </a>
            </v-col>
            <v-btn
              color="orange-darken-1" variant="text" @click="calculateItem"
              :disabled="item.technology.computed||!valid||!item.technology.workpiece||item.technology.setups.length===0">
              Рассчитать
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn color="orange-darken-1" variant="text" @click="hideDialog">
              Закрыть
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>
  </v-container>
</template>

<script setup>
import {useStore} from "vuex";
import {computed, ref, watch} from "vue";
import TechWorkpieceCard from "@/components/technology/TechWorkpieceCard.vue";
import SetupCreateCard from "@/components/technology/SetupCreateCard.vue";
import api from "@/api/instance";
import 'vue-toast-notification/dist/theme-bootstrap.css'
import {useToast} from 'vue-toast-notification';
import materialDataFormatting from '@/mixins/MaterialDataFormatting'
import {useValidationRules} from "@/mixins/FieldValidationRules";

const {rules} = useValidationRules();
const store = useStore();
const toast = useToast();
const form = ref(null);
const valid = ref(false);
const workpieceCardVisible = ref(false);
const {formatObjectData} = materialDataFormatting();

const isDialogVisible = computed(() => store.getters.isTechnologyDialogVisible);
const item = computed(() => store.getters.getItem);
const materials = computed(() => store.getters.getMaterials);
const setups = computed(() => item.value.technology.setups.slice().sort((a, b) => a.setupNumber - b.setupNumber))

const getUniqueItems = (key) => {
  if (!item.value.technology.setups) {
    return [];
  }
  const combined = item.value.technology.setups.flatMap(setup => setup[key]);
  return combined.filter((item, index, self) =>
    index === self.findIndex(t => t.id === item.id)
  );
};

const techSpecials = computed(() => getUniqueItems('specialTools'));
const techMeasurers = computed(() => getUniqueItems('measureTools'));
const techToolings = computed(() => getUniqueItems('toolings'));

const compactInfo = ((data) => {
  if (data.operation.operationType === 'FROM_OPERATION_WITH_CALC'
    || data.operation?.operationType === 'FROM_OPERATION') {
    return `Обработка: ${data.processTime}`
  } else if (data.operation.operationType === 'FROM_PROCESS_UNIT') {
    return `Обработка: ${data.processTime} Наладка: ${data.setupTime} Межоперационка: ${data.interoperativeTime}`
  } else {
    return '';
  }
});

const newSetup = ref({
  isVisible: false,
  technology: item.value.technology,
  setupTime: "00:00",
  processTime: "00:00",
  interoperativeTime: "00:00",
  measureTools: [],
  specialTools: [],
  toolings: [],
  additionalTools: [],
});

watch(item, (newValue) => {
  if (newValue && newValue.technology) {
    newSetup.value.technology = newValue.technology;
  }
});

const calculateSetupNumber = computed(() => {
  if (!item.value.technology.setups) {
    return -1
  }
  const setupNumbers = item.value.technology.setups.map(setup => setup.setupNumber);
  for (let i = 10; i <= Number.MAX_SAFE_INTEGER; i = i + 10) {
    if (!setupNumbers.includes(i)) {
      return i;
    }
  }
  return -1;
});

const save = async () => {
  await store.dispatch("saveTechnology", item.value.technology);
  await store.dispatch("fetchItem", item.value.id);
};

const hideSetup = (setup) => {
  store.dispatch("fetchItem", item.value.id);
  setup.isVisible = false;
};

const deleteSetup = async (setup) => {
  await store.dispatch("deleteSetup", setup);
  await store.dispatch("fetchItem", item.value.id);
};

const hideDialog = () => {
  store.commit("setTechnologyDialogVisible", false);
};

const calculateItem = async () => {
  await save();
  await api.get("/doc/calculate", {
    params: {itemId: item.value.id},
  })
    .then(async () => {
      toast.info("Успешно!", {position: "top-right"});
      await store.dispatch("fetchItem", item.value.id);
    })
    .catch(error => {
      toast.error(error.response.data.info, {position: "top-right"});
    });
};

const saveWorkpiece = (validWorkpiece) => {
  item.value.technology.workpiece = validWorkpiece;
};

const hideWorkpieceCard = () => {
  workpieceCardVisible.value = false;
};

const showWorkpieceCard = () => {
  workpieceCardVisible.value = true;
};
</script>

<style>

.dialog-content {
  max-height: 100vh;
  overflow-y: auto;
}

.v-toast {
  z-index: 9999 !important;
}

</style>
