<template>
  <v-dialog v-model="isCutterCreateDialogVisible" width="768">
    <v-form ref="form" v-model="valid" @submit.prevent="save()">
      <v-card>
        <v-card-title>
          <span class="text-h5">Инструмент:</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="4">
                <v-text-field
                  label="Торговое название:"
                  v-model="cutterTool.toolName"
                  :rules="[rules.required,rules.counter,rules.nameValidation]"
                  counter
                  maxlength="20">
                </v-text-field>
              </v-col>
              <v-col cols="4">
                <v-text-field
                  label="Описание:"
                  v-model="cutterTool.description"
                  :rules="[rules.required,rules.counter,rules.nameValidation]"
                  counter
                  maxlength="20">
                </v-text-field>
              </v-col>
<!--              <v-col cols="4">-->
<!--                <v-text-field-->
<!--                  label="Стоимость инструмента:"-->
<!--                  v-model="cutterTool.price.amount"-->
<!--                  :rules="[rules.required, rules.priceValidation]"-->
<!--                  counter-->
<!--                  maxlength="40"-->
<!--                ></v-text-field>-->
<!--              </v-col>-->
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="orange-darken-1" variant="text" @click="hideCutterCreateDialogVisible">
            Закрыть
          </v-btn>
          <v-btn color="orange-darken-1" variant="text" type="submit" :disabled="!valid">
            Сохранить
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>
<script>
import {computed, ref} from "vue";
import {useStore} from "vuex";

export default {
  name: "cutter-tool-create-dialog",
  setup() {
    const store = useStore();

    const form = ref(null);
    const valid = ref(false);

    const cutterTool = computed(() => store.getters.getCutter);
    const isCutterCreateDialogVisible = computed(() => store.getters.isCutterCreateDialogVisible);
    const hideCutterCreateDialogVisible = () => {
      store.commit("setCutterCreateDialogVisible", false);
    };

    const save = () => {
      if (form.value.validate()) {
        //cutterTool.value.price.currency = 'RUB';
        store.dispatch("saveCutter", cutterTool.value);
        hideCutterCreateDialogVisible();
      }
    };

    const rules = {
      required: (value) => !!value || "Обязательное поле",
      counter: (value) => value.length <= 200 || "Не более 200 символов",
      nameValidation: (value) => value.length >= 3 || "Минимальное количество символов: 3",
      priceValidation: value => {
        const pattern = /^[0-9]{1,10}$/
        return pattern.test(value) || 'Неверный формат, введите 1-10 цифр'
      },
    };

    return {
      hideCutterCreateDialogVisible,
      isCutterCreateDialogVisible,
      form,
      valid,
      save,
      rules,
      cutterTool
    };
  },
};
</script>
