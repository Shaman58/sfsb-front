<template>
  <v-dialog v-model="props.visible" persistent>
    <v-card>
      <v-form ref="form" v-model="valid" @submit.prevent="save(operation)">
        <v-card-text>
          <v-row>
            <v-col cols="4">
              <v-text-field label="Название операции:"
                            v-model="operation.operationName"
                            :rules="[rules.required, rules.nameValidation]"
                            counter
                            :disabled="operation.id<3">
              </v-text-field>
            </v-col>
            <v-col cols="4">
              <v-select label="Описание:"
                        :items="operations"
                        item-title="title"
                        item-value="label"
                        v-model="operation.operationTimeManagement"
                        :disabled="operation.id<3">
              </v-select>
            </v-col>
            <v-col cols="4">
              <v-text-field label="Стоимость за час:"
                            v-model="operation.paymentPerHour.amount"
                            :rules="[rules.required,rules.numeric]"
                            type="number"
              ></v-text-field>
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
        <v-container v-if="!operation.id||operation.id>=3">
          <v-row>
            <v-col cols="4">
              <v-card>
                Станочная - применяется для назначения машинных операций с временем <a class="text-cyan">операции</a>,
                <a class="text-cyan">наладки</a> и
                <a class="text-cyan">межоперационки</a>
              </v-card>
            </v-col>
            <v-col cols="4">
              <v-card>
                Ручная - применяется для назначения ручных операций с временем <a class="text-cyan">операции</a> БЕЗ <a
                class="text-red">наладки</a> и
                <a class="text-red">межоперационки</a>
              </v-card>
            </v-col>
            <v-col cols="4">
              <v-card>Вычисляемая - применяется для назначения операции с временем <a class="text-cyan">операции</a> и
                возможностью обработки по
                <a class="text-cyan">несколько ЗАГОТОВОК</a>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script setup>
import {useStore} from "vuex";
import {useValidationRules} from "@/mixins/FieldValidationRules";
// import useOperationFormatting from "@/mixins/OperationDataFormatting"
import CONST from "@/consts"
import {ref} from "vue";

const props = defineProps({
  operation: {
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
// const {operations} = useOperationFormatting();
const operations = CONST.OPERATIONS

const form = ref(null);
const valid = ref(false);
const operation = ref({...props.operation, paymentPerHour: {...props.operation.paymentPerHour}});

const save = (operation) => {
  if (form.value.validate()) {
    emit("save", operation);
    emit("hide");
  }
};

const hide = () => {
  emit("hide");
  operation.value = {...props.operation}
}

</script>
