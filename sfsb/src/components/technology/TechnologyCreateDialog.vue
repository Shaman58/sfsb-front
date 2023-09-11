<template>
  <v-container fluid>
    <v-dialog v-model="isDialogVisible" fullscreen>
      <v-form ref="form" v-model="valid" @submit.prevent="save()">
        <v-card class="dialog-content">
          <v-card-title>
            <span class="text-h4">{{ item.technology.drawingNumber + " " + item.technology.drawingName }}</span>
            {{ item.quantity + "шт." }}
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
                      !!item.technology.workpiece ? formatMaterialData(item.technology.workpiece.material) : "Задать заготовку"
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

            <br/>
            <v-divider/>
            <br/>

            <v-row>

              <v-col cols="12" v-for="(setup, index) in sortedSetups" :key="index">
                <v-card v-if="!(setup.isVisible)" @click="setup.isVisible = true">
                  <v-row>

                    <v-col cols="3" v-if="!setup.cooperate"> <!-- 1 часть карточки -->
                      <v-card>
                        <v-card-title>
                          <a>
                            {{ "№" + setup.setupNumber + " " + setup.operation.operationName }}
                          </a>
                        </v-card-title>
                        <v-card-item>
                          {{ compactInfo(setup) }}
                        </v-card-item>
                        <v-list v-if="!!setup.toolings && setup.operation.operationTimeManagement!=='COMPUTED'
                         && setup.operation.operationTimeManagement!=='NONE'">
                          <v-list-item v-for="tooling in setup.toolings"
                                       :title="tooling.toolName"/>
                        </v-list>
                      </v-card>
                    </v-col>

                    <v-col cols="3" v-if="!setup.cooperate
                    && setup.operation.operationTimeManagement!=='COMPUTED'
                    && setup.operation.operationTimeManagement!=='NONE'">
                      <!-- 2 часть карточки -->
                      <v-card height="100%" v-if="setup.additionalTools.length!==0">
                        <v-list density="compact" style="padding: 0;" :lines="false">
                          <v-list-item v-for="(tool, index) in setup.additionalTools" :key="index"
                                       :title="tool.toolName"
                                       :subtitle="formatWorkpieceData(tool.workpiece)">
                          </v-list-item>
                        </v-list>
                      </v-card>
                    </v-col>

                    <v-col cols="3" v-if="!setup.cooperate
                     && setup.operation.operationTimeManagement!=='COMPUTED'
                     && setup.operation.operationTimeManagement!=='NONE'">
                      <!-- 3 часть карточки -->
                      <v-card height="100%" v-if="setup.cutterToolItems.length!==0&&setup.specialToolItems.length!==0">
                        <v-list density="compact" style="padding: 0;" :lines="false">
                          <v-list-item v-for="(tool, index) in setup.cutterToolItems" :key="index"
                                       :title="tool.tool.toolName"
                                       :subtitle="tool.amount +'шт.'">
                          </v-list-item>
                        </v-list>
                        <v-list density="compact" style="padding: 0;" :lines="false">
                          <v-list-item v-for="(tool, index) in setup.specialToolItems" :key="index"
                                       :title="tool.tool.toolName"
                                       :subtitle="tool.amount +'шт.'">
                          </v-list-item>
                        </v-list>
                      </v-card>
                    </v-col>

                    <v-col cols="3" fill-height
                           v-if="!setup.cooperate
                           && setup.operation.operationTimeManagement!=='COMPUTED'
                           && setup.operation.operationTimeManagement!=='NONE'">
                      <!-- 4 часть карточки -->
                      <v-card height="100%" v-if="setup.measureTools.length!==0">
                        <v-list density="compact" style="padding: 0;" :lines="false">
                          <v-list-item v-for="(tool, index) in setup.measureTools" :key="index"
                                       :title="tool.toolName"
                                       :subtitle="tool.description">
                          </v-list-item>
                        </v-list>
                      </v-card>
                    </v-col>
                    <v-col cols="12" fill-height v-if="setup.cooperate"> <!-- 234 часть карточки -->
                      <v-card height="100%"
                              :title="'№' + setup.setupNumber + ' ' + setup.operation.operationName + ' кооперация'"
                              color="rgba(161, 48, 13, 0.24)">
                      </v-card>
                    </v-col>

                  </v-row>
                </v-card>
                <setup-create-card
                  v-else
                  :setup="{...setup}"
                  :quantity-of-parts-from-workpiece="Number(item.technology.quantityOfPartsFromWorkpiece)"
                  @hideSetup="hideSetup(setup)"
                  @deleteSetup="deleteSetup(index)"
                  @save="replaceSetup($event, index)"
                />
              </v-col>

              <v-col cols="12">
                <v-card
                  title="Новый установ"
                  v-if="!newSetup.isVisible"
                  @click="newSetup.isVisible=true">
                </v-card>
                <setup-create-card
                  v-else
                  :setup="{...newSetup}"
                  :quantity-of-parts-from-workpiece="Number(item.technology.quantityOfPartsFromWorkpiece)"
                  @hideSetup="hideSetup(newSetup)"
                  @save="pushSetup"/>
              </v-col>

            </v-row>

          </v-card-text>
          <v-card-actions>
            <v-col cols="2">
              <a>
                {{ item.technology.computed ? 'Рассчитан' : 'Не рассчитан' }}
              </a>
            </v-col>
            <v-btn color="orange-darken-1" variant="text" type="submit"
                   :disabled="!valid || !item.technology.workpiece">
              Сохранить
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
import {computed, ref} from "vue";
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
const {formatMaterialData, formatWorkpieceData} = materialDataFormatting();

const isDialogVisible = computed(() => store.getters.isTechnologyDialogVisible);
const item = computed(() => store.getters.getItem);
const materials = computed(() => store.getters.getMaterials);
const sortedSetups = computed(() => {
  return item.value.technology.setups.slice().sort((a, b) => a.setupNumber - b.setupNumber);
});


const compactInfo = ((data) => {
  if (data.operation?.operationTimeManagement === 'COMPUTED'
    || data.operation?.operationTimeManagement === 'PROCESS_TIME_ONLY') {
    return `Обработка: ${data.processTime}`
  } else if (data.operation?.operationTimeManagement === 'FULL') {
    return `Обработка: ${data.processTime} Наладка: ${data.setupTime} Межоперационка: ${data.interoperativeTime}`
  } else {
    return '';
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

const createNewSetup = () => ({
  isVisible: false,
  setupTime: "00:00",
  processTime: "00:00",
  interoperativeTime: "00:00",
  measureTools: [],
  specialToolItems: [],
  cutterToolItems: [],
  toolings: [],
  additionalTools: [],
  setupNumber: calculateSetupNumber,
  operation: {
    operationName: ''
  }
});

const newSetup = ref(createNewSetup());

const save = async () => {
  await store.dispatch("saveTechnology", item.value.technology);
  await store.dispatch("fetchItem", item.value.id);
};

const pushSetup = ({...setup}) => {
  hideSetup(setup);
  item.value.technology.setups.push(setup);
  item.value.technology.setups = item.value.technology.setups.slice().sort((a, b) => a.setupNumber - b.setupNumber);
};

const replaceSetup = (setup, index) => {
  hideSetup(setup);
  item.value.technology.setups.splice(index, 1);
  item.value.technology.setups.push(setup);
  item.value.technology.setups = item.value.technology.setups.slice().sort((a, b) => a.setupNumber - b.setupNumber);
};

const hideSetup = (setup) => {
  setup.isVisible = false;
  newSetup.value = createNewSetup();
};

const deleteSetup = async (index) => {
  item.value.technology.setups.splice(index, 1);
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
