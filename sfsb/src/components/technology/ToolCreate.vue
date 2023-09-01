<template>
  <v-dialog v-model="visible">
    <v-card>
      <v-form ref="form" v-model="valid" @submit.prevent="save(tool)">
        <v-card-title>
          <span class="text-h5">{{ props.title }}:</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="4">
                <v-text-field
                  label="Торговое название:"
                  v-model="tool.toolName"
                  :rules="[rules.required,rules.counter,rules.nameValidation]"
                  counter
                  maxlength="20">
                </v-text-field>
              </v-col>
              <v-col cols="4">
                <v-text-field
                  label="Описание:"
                  v-model="tool.description"
                  :rules="[rules.required,rules.counter,rules.nameValidation]"
                  counter
                  maxlength="20">
                </v-text-field>
              </v-col>
              <v-col cols="4">
                <v-text-field
                  label="Количество:"
                  v-model="tool.amount"
                  :rules="[rules.required, rules.counter]"
                  counter
                  type="number"
                  maxlength="20">
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
  </v-dialog>
</template>

<script setup>
import {getCurrentInstance, ref} from "vue";
import {useStore} from "vuex";
import {useValidationRules} from "@/mixins/FieldValidationRules";

// ---- ПРОПСЫ ----
const props = defineProps({
  title: {
    type: String,
    required: true
  },
});

const {rules} = useValidationRules();
const visible = ref(true);
const {emit} = getCurrentInstance();
const store = useStore();
const form = ref(null);
const valid = ref(false);
const tool = ref({});

const hide = () => emit('hide');

const save = (tool) => {
  emit('save', tool);
  hide();
};

</script>
