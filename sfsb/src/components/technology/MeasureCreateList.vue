<template>
  <v-dialog v-model="props.visible" persistent>
    <v-card>
      <v-form ref="form" v-model="valid" @submit.prevent="save(toolItem)">
        <v-card-title>
          <span class="text-h5">Меритель:</span>
        </v-card-title>
        <v-card-text>

          <v-container v-if="tools.length!==0">
            <v-list>
              <v-list-item
                v-for="(tool, index) in tools"
                :key="index"
                :title="tool.tool.toolName +'   '+ tool.tool.description"
                :subtitle="tool.amount+'шт.'">
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
              <v-col cols="4">
                <v-text-field
                  label="Название:"
                  v-model="toolItem.tool.toolName"
                  :rules="[rules.required, rules.nameValidation]"
                  counter>
                </v-text-field>
              </v-col>
              <v-col cols="4">
                <v-text-field
                  label="Описание:"
                  v-model="toolItem.tool.description"
                  :rules="[rules.required, rules.nameValidation]"
                  counter>
                </v-text-field>
              </v-col>
              <v-col cols="4">
                <v-text-field
                  label="Количество:"
                  v-model="toolItem.amount"
                  :rules="[rules.required, rules.minValidation]"
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
            Добавить
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script setup>
import {getCurrentInstance, ref} from "vue";
import {useValidationRules} from "@/mixins/FieldValidationRules";

// ---- ПРОПСЫ ----
const props = defineProps({
  visible: {
    type: Boolean,
    required: true
  },
  tools: {
    type: Array,
    required: true
  },
});

const {rules} = useValidationRules();
const {emit} = getCurrentInstance();
const form = ref(null);
const valid = ref(false);
const toolItem = ref({tool: {}});
const tools = ref(props.tools);

const hide = () => {
  emit('hide');
};

const save = (savedTool) => {
  tools.value.push({...savedTool});
  toolItem.value = {tool: {}};
};

const remove = (index) => {
  tools.value.splice(index, 1);
};

</script>
