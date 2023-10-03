<template>
  <v-dialog v-model="isVisible" persistent>
    <v-card>
      <v-form ref="form" v-model="valid" @submit.prevent="save()">
        <v-card-text>
          <v-row>
            <v-col cols="4">
              <v-text-field
                label="Название:"
                v-model="cutter.toolName"
                :rules="[rules.required, rules.nameValidation]"
                counter>
              </v-text-field>
            </v-col>
            <v-col cols="4">
              <v-text-field
                label="Описание:"
                v-model="cutter.description"
                :rules="[rules.required]">
              </v-text-field>
            </v-col>
          </v-row>
          <v-card-actions>
            <v-spacer/>
            <v-btn
              color="orange-darken-1"
              variant="text"
              @click="hide">
              Закрыть
            </v-btn>
            <v-btn
              color="orange-darken-1"
              variant="text" type="submit"
              :disabled="!valid">
              Сохранить
            </v-btn>
          </v-card-actions>
        </v-card-text>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script setup>
import {useStore} from "vuex";
import {computed, ref} from "vue";
import {useValidationRules} from "@/mixins/FieldValidationRules";

const store = useStore();
const {rules} = useValidationRules();

const form = ref(null);
const valid = ref(false);

const isVisible = computed(() => store.getters.getCutterDialogVisible);
const cutter = computed(() => store.getters.getCutter);

const hide = (() => {
  store.commit("setCutterDialogVisible", false);
});

const save = () => {
  if (form.value.validate()) {
    store.dispatch("saveCutter", cutter.value);
    hide();
  }
};

</script>
