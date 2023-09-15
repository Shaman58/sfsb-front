<template>
  <v-dialog v-model="props.visible" persistent>
    <v-card>
      <v-form ref="form" v-model="valid" @submit.prevent="save(toolItem)">
        <v-card-title>
          <span class="text-h5">Приспособление</span>
        </v-card-title>
        <v-card-text>

          <v-container v-if="additionals.length!==0">
            <v-list>
              <v-list-item
                v-for="(tool, index) in additionals"
                :key="index"
                :title="tool.toolName + ' ' + formatWorkpieceData(tool.workpiece)"
                :subtitle="tool.amount + 'шт.'">
                <template v-slot:append>
                  <v-btn
                    color="orange-lighten-1"
                    icon="mdi-delete"
                    variant="text"
                    @click.stop="remove(index)"
                  ></v-btn>
                </template>
              </v-list-item>
            </v-list>
          </v-container>

          <v-container>
            <v-row>
              <v-col cols="4" v-if="!workpieceCardVisible">
                <v-card
                  width="200"
                  title="Заготовка:"
                  @click="showWorkpieceCard">
                  <v-card-item>
                    {{
                      !!toolItem.workpiece ? formatWorkpieceData(toolItem.workpiece) : "Задать заготовку"
                    }}
                  </v-card-item>
                </v-card>
              </v-col>
              <v-col v-else>
                <tech-workpiece-card
                  :workpiece="{...toolItem.workpiece}"
                  :materials="materials"
                  @validatedWorkpiece="saveWorkpiece"
                  @hide="hideWorkpieceCard"
                />
              </v-col>
              <v-col cols="5" v-if="!workpieceCardVisible">
                <v-text-field
                  label="Название приспособы"
                  v-model="toolItem.toolName"
                  :rules="[rules.required, rules.nameValidation()]"
                />
              </v-col>
              <v-col cols="3" v-if="!workpieceCardVisible">
                <v-text-field
                  label="Количество"
                  v-model="toolItem.amount"
                  :rules="[rules.required, rules.minValidation]"
                />
              </v-col>
            </v-row>
          </v-container>

        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="orange-darken-1" variant="text" @click="hide">
            Закрыть
          </v-btn>
          <v-btn color="orange-darken-1" variant="text" type="submit" :disabled="!valid || !toolItem.workpiece">
            Добавить
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script setup>
import {computed, getCurrentInstance, reactive, ref} from "vue";
import {useValidationRules} from "@/mixins/FieldValidationRules";
import TechWorkpieceCard from "@/components/technology/TechWorkpieceCard.vue";
import store from "@/store";
import materialDataFormatting from "@/mixins/MaterialDataFormatting";
import {ru} from "vuetify/locale";

// ---- ПРОПСЫ ----
const props = defineProps({
  visible: {
    type: Boolean,
    required: true
  },
  additionals: {
    type: Array,
    required: true,
    default: [{
      workpiece: Object,
      toolName: String,
      amount: Number
    }]
  },
});

const {rules} = useValidationRules();
const {emit} = getCurrentInstance();
const form = ref(null);
const valid = ref(false);
const toolItem = ref({});
const {formatWorkpieceData} = materialDataFormatting();
const workpieceCardVisible = ref(false);
const additionals = reactive(props.additionals);
const materials = computed(() => store.getters.getMaterials);

const showWorkpieceCard = () => {
  workpieceCardVisible.value = true;
};

const hideWorkpieceCard = () => {
  workpieceCardVisible.value = false;
};

const saveWorkpiece = (validWorkpiece) => {
  toolItem.value.workpiece = validWorkpiece;
};

const hide = () => {
  emit('hide');
};

const save = (savedTool) => {
  additionals.push({...savedTool});
  toolItem.value = {workpiece: undefined, toolName: ''};
};

const remove = (index) => {
  additionals.splice(index, 1);
};

</script>
