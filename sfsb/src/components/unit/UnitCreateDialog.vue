<template>
  <v-dialog v-model="unitCreateDialogVisible" width="768">
    <v-form ref="form" v-model="valid" @submit.prevent="save()">
      <v-card>
        <v-card-title>
          <span class="text-h5">Единица оборудования:</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  label="Название"
                  v-model="selectedUnit.unitName"
                  :rules="[rules.required, rules.counter]"
                  counter
                  maxlength="40"
                ></v-text-field>
              </v-col>
<!--              <v-col cols="4">-->
<!--                <v-text-field-->
<!--                  label="Стоимость оборудования"-->
<!--                  v-model="selectedUnit.price.amount"-->
<!--                  :rules="[rules.required, rules.priceValidation]"-->
<!--                  counter-->
<!--                  maxlength="40"-->
<!--                ></v-text-field>-->
<!--              </v-col>-->
              <v-col cols="4">
                <v-text-field
                  label="Стоимость часа оборудования"
                  v-model="selectedUnit.paymentPerHour.amount"
                  :rules="[rules.required, rules.paymentPerHourValidation]"
                  counter
                  maxlength="40"
                ></v-text-field>
              </v-col>
              <v-col cols="4">
                <v-text-field
                  label="Внутренний номер станка"
                  v-model="selectedUnit.unitNumber"
                  :rules="[rules.required, rules.unitNumberValidation]"
                  counter
                  maxlength="40"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="orange-darken-1" variant="text" @click="hideUnitCreateDialog">
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
  name: "unit-create-dialog",
  setup() {
    const store = useStore();

    const unitCreateDialogVisible = computed(() => store.getters.isUnitDialogVisible);
    const selectedArea = computed(() => store.getters.getSelectedArea);
    const selectedUnit = computed(() => store.getters.getSelectedUnit);

    const form = ref(null);
    const valid = ref(false);

    const rules = {
      required: value => !!value || 'Обязательное поле',
      counter: value => value.length <= 200 || 'Не более 200 символов',
      priceValidation: value => {
        const pattern = /^[0-9]{1,10}$/
        return pattern.test(value) || 'Неверный формат, введите 1-10 цифр'
      },
      paymentPerHourValidation: value => {
        const pattern = /^[0-9]{1,5}$/
        return pattern.test(value) || 'Неверный формат, введите 1-5 цифр'
      },
      unitNumberValidation: value => {
        const pattern = /^[0-9]{1,5}$/
        const unitNumbers = selectedArea.value.units.filter(unit => unit.id !== selectedUnit.value.id).map(obj => obj.unitNumber);
        const isUnique = !unitNumbers.includes(Number(value))
        return pattern.test(value) && isUnique || 'Неверный формат или число уже присутствует в массиве'
      },
    };

    const hideUnitCreateDialog = () => {
      store.commit("setUnitCreateDialog", false);
    };

    const save = () => {
      if (form.value.validate()) {
        store.dispatch("saveUnit", selectedUnit.value);
        hideUnitCreateDialog();
      }
    };

    return {
      selectedUnit,
      unitCreateDialogVisible,
      valid,
      rules,
      form,
      save,
      hideUnitCreateDialog,
    };
  },
};
</script>
