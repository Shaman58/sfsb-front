<template>
  <v-dialog v-model="props.visible" persistent>
    <v-card>
      <v-form ref="form" v-model="valid" @submit.prevent="save(tool)">
        <v-card-text>
          <v-row>
            <v-col cols="4">
              <v-text-field label="Название:"
                            v-model="tool.toolName"
                            :rules="[rules.required, rules.nameValidation]"
                            counter>
              </v-text-field>
            </v-col>
            <v-col cols="4">
              <v-text-field label="Описание:"
                            v-model="tool.description"
                            :rules="[rules.required]">
              </v-text-field>
            </v-col>
          </v-row>
          <v-card-actions>
            <v-spacer/>
            <v-btn color="orange-darken-1"
                   variant="text"
                   @click="hide">
              Закрыть
            </v-btn>
            <v-btn color="orange-darken-1"
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
import {ref} from "vue";
import {useValidationRules} from "@/mixins/FieldValidationRules";

const props = defineProps({
  tool: {
    type: Object,
    required: true
  },
  visible: {
    type: Boolean,
    required: true
  }
});

const emit = defineEmits();
const store = useStore();
const {rules} = useValidationRules();

const form = ref(null);
const valid = ref(false);
const tool = ref({...props.tool});

const save = (data) => {
  if (form.value.validate()) {
    emit("save", data);
    emit("hide");
  }
};

const hide = () => {
  emit("hide");
  tool.value = {...props.tool};
}

</script>
