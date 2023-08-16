<template>
  <v-container fluid>
    <v-dialog v-model="isDialogVisible" fullscreen>
      <v-form ref="form" v-model="valid" @submit.prevent="save()">
        <v-card class="dialog-content">
          <v-card-title>
            <span class="text-h5">{{ technology.drawingNumber + " " + technology.drawingName }}</span>
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
                    {{ !!technology.workpiece ? formatObjectData(technology.workpiece) : "Задать заготовку" }}
                  </v-card-item>
                </v-card>
                <tech-workpiece-card
                  v-else
                  :workpiece="{...technology.workpiece}"
                  :materials="materials"
                  @validatedWorkpiece="saveWorkpiece"
                  @hide="hideWorkpieceCard"
                />
              </v-col>
              <v-col cols="3" v-if="!workpieceCardVisible">
                <v-text-field
                  label="Из заготовки"
                  v-model="technology.quantityOfPartsFromWorkpiece"
                  type="number"
                  :rules="[rules.required, rules.numberValidate, rules.min]"
                />
              </v-col>
              <v-col cols="3" v-if="!workpieceCardVisible">
                <v-text-field
                  label="Наладочных"
                  v-model="technology.quantityOfSetUpParts"
                  type="number"
                  :rules="[rules.required, rules.numberValidate, rules.min]"
                />
              </v-col>
              <v-col cols="3" v-if="!workpieceCardVisible">
                <v-text-field
                  label="На брак"
                  v-model="technology.quantityOfDefectiveParts"
                  type="number"
                  :rules="[rules.required, rules.numberValidate, rules.min]"
                />
              </v-col>
            </v-row>

            <br/>
            <v-divider/>
            <br/>

            <v-row>
              <v-col cols="8">
                <v-row>

                  <v-col cols="12" v-for="(item, index) in sortedSetups" :key="index">
                    <v-card v-if="!(item.isVisible)"
                            :title="item.setupName"
                            @click="item.isVisible = true">
                      <v-card-item>
                        {{ item.setupNumber }}
                      </v-card-item>
                    </v-card>
                    <setup-create-card
                      v-else
                      :setup="{...item}"
                      @hideSetup="hideSetup(item)"
                      @deleteSetup="deleteSetup(item)"/>
                  </v-col>

                  <v-col cols="12">
                    <v-card
                      title="Новый установ"
                      v-if="!newSetup.isVisible"
                      @click="newSetup.isVisible = true">
                    </v-card>
                    <setup-create-card
                      v-else
                      :setup="{...newSetup, setupNumber:calculateSetupNumber}"
                      @hideSetup="hideSetup(newSetup)"/>
                  </v-col>

                </v-row>
              </v-col>

              <v-col cols="4">
                <v-card title="Расходники:">
                  <v-card-item v-if="techCutters.length!==0">
                    Режущий инструмент:
                    <v-list>
                      <v-list-item
                        v-for="item in techCutters"
                        :title="item.toolName"/>
                    </v-list>
                  </v-card-item>
                  <v-card-item v-if="techSpecials.length!==0">
                    Специнструмент:
                    <v-list>
                      <v-list-item
                        v-for="item in techSpecials"
                        :title="item.toolName"/>
                    </v-list>
                  </v-card-item>
                  <v-card-item v-if="techMeasurers.length!==0">
                    Mеритель:
                    <v-list>
                      <v-list-item
                        v-for="item in techMeasurers"
                        :title="item.toolName"/>
                    </v-list>
                  </v-card-item>
                  <v-card-item v-if="techToolings.length!==0">
                    Оснастка:
                    <v-list>
                      <v-list-item
                        v-for="item in techToolings"
                        :title="item.toolingName"/>
                    </v-list>
                  </v-card-item>
                </v-card>
              </v-col>
            </v-row>

          </v-card-text>
          <v-card-actions>
            <v-col cols="2">
              <v-switch
                v-model="technology.computed"
                :true-value="true"
                :false-value="false"
                :label="technology.computed ? 'Рассчитан': 'Не рассчитан' ">
              </v-switch>
            </v-col>
            <v-btn
              color="orange-darken-1" variant="text" @click="calculateItem">
              Рассчитать
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn color="orange-darken-1" variant="text" @click="hideDialog">
              Закрыть
            </v-btn>
            <v-btn color="orange-darken-1" variant="text" type="submit" :disabled="!valid">
              Сохранить
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>
  </v-container>
</template>

<script>
import {useStore} from "vuex";
import {computed, ref} from "vue";
import TechWorkpieceCard from "@/components/technology/TechWorkpieceCard.vue";
import SetupCreateCard from "@/components/setup/SetupCreateCard.vue";

export default {
  name: "technology-create-dialog",
  components: {SetupCreateCard, TechWorkpieceCard},

  setup() {
    const store = useStore();

    const form = ref(null);
    const valid = ref(false);

    const isDialogVisible = computed(() => store.getters.isTechnologyDialogVisible);
    const technology = computed(() => store.getters.getTechnology);
    const workpiece = computed(() => store.getters.getWorkpiece);
    const sortedSetups = computed(() => store.getters.getSetups);
    const materials = computed(() => store.getters.getMaterials);

    const techCutters = computed(() => {
      const combined = technology.value.setups.flatMap(setup => setup.cutterTools);

      return combined.filter((item, index, self) =>
        index === self.findIndex(t => t.id === item.id)
      );
    });

    const techSpecials = computed(() => {
      const combined = technology.value.setups.flatMap(setup => setup.specialTools);

      return combined.filter((item, index, self) =>
        index === self.findIndex(t => t.id === item.id)
      );
    });

    const techMeasurers = computed(() => {
      const combined = technology.value.setups.flatMap(setup => setup.measureTools);

      return combined.filter((item, index, self) =>
        index === self.findIndex(t => t.id === item.id)
      );
    });

    const techToolings = computed(() => {
      const combined = technology.value.setups.flatMap(setup => setup.toolings);

      return combined.filter((item, index, self) =>
        index === self.findIndex(t => t.id === item.id)
      );
    });

    const newSetup = ref({
      isVisible: false,
      technology: technology,
      setupName: '',
      setupTime: "00:01",
      processTime: "00:01",
      measureTools: [],
      interoperativeTime: "00:01",
      cutterTools: [],
      additionalTools: [],
      specialTools: [],
      toolings: []
    });

    const calculateSetupNumber = computed(() => {
      const setupNumbers = sortedSetups.value.map(setup => setup.setupNumber);
      for (let i = 1; i <= Number.MAX_SAFE_INTEGER; i++) {
        if (!setupNumbers.includes(i)) {
          return i;
        }
      }
      return -1
    });

    const isTechWorkpieceDialogVisible = computed(() => store.getters.isWorkpieceCreateDialogVisible);
    const save = () => {
      store.dispatch("saveTechnology", technology.value);
    };

    const hideSetup = (item) => {
      item.isVisible = false;
    };

    const deleteSetup = (item) => {
      store.dispatch("deleteSetup", item);
      store.dispatch("fetchTechnologyById", technology.value.id);
    };

    const showWorkpieceDialog = () => {
      store.commit("setWorkpiece", technology.value.workpiece ? {...technology.value.workpiece} : {});
      store.commit("setWorkpieceCreateDialogVisible", true);
    };

    const hideDialog = () => {
      store.commit("setTechnologyDialogVisible", false);
    };

    const calculateItem = () => {

    }

    const formatObjectData = (data) => {
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
    };


    const workpieceCardVisible = ref(false);

    const saveWorkpiece = (validWorkpiece) => {
      technology.value.workpiece = validWorkpiece;
    };

    const hideWorkpieceCard = () => {
      workpieceCardVisible.value = false;
    };

    const showWorkpieceCard = () => {
      workpieceCardVisible.value = true;
    };

    const rules = {
      required: (value) => !!value || "Обязательное поле",
      counter: (value) => value.length <= 200 || "Не более 200 символов",
      numberValidate: value => {
        const pattern = /^[0-9]{1,5}$/
        return pattern.test(value) || 'Неверный формат, введите 1-5 цифр'
      },
      min: value => {
        return value > 0 || 'Неверный формат, должно быть больше 0'
      }
    };


    return {
      isDialogVisible,
      technology,
      save,
      form,
      valid,
      hideDialog,
      showWorkpieceDialog,
      formatObjectData,
      workpiece,
      isTechWorkpieceDialogVisible,
      newSetup,
      calculateSetupNumber,
      sortedSetups,
      hideSetup,
      deleteSetup,
      saveWorkpiece,
      hideWorkpieceCard,
      workpieceCardVisible,
      showWorkpieceCard,
      materials,
      techSpecials,
      techCutters,
      techMeasurers,
      techToolings,
      calculateItem,
      rules
    }
  }
}
</script>

<style>

.dialog-content {
  max-height: 100vh;
  overflow-y: auto;
}

</style>
