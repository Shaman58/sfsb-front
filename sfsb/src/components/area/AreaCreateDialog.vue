<template>
  <v-dialog v-model="areaCreateDialogVisible" width="768">
    <v-form ref="form" v-model="valid" @submit.prevent="save()">
      <v-card>
        <v-card-title>
          <span class="text-h5">Площадка</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  label="Имя"
                  v-model="selectedArea.areaName"
                  :rules="[rules.required, rules.counter]"
                  counter
                  maxlength="40"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="orange-darken-1" variant="text" @click="hideAreaCreateDialog">
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
  name: "area-create-dialog",
  setup() {
    const store = useStore();

    const areaCreateDialogVisible = computed(() => store.getters.isAreaCreateDialogVisible);
    const selectedArea = computed(() => store.getters.getSelectedArea)

    const form = ref(null);
    const valid = ref(false);

    const rules = {
      required: (value) => !!value || "Обязательное поле",
      counter: (value) => value.length <= 200 || "Не более 200 символов",
    };

    const hideAreaCreateDialog = () => {
      store.commit("setCreateAreaDialog", false);
    };

    const save = () => {
      if (form.value.validate()) {
        store.dispatch("saveArea", selectedArea.value);
        hideAreaCreateDialog();
      }
    };

    return {
      selectedArea,
      areaCreateDialogVisible,
      valid,
      rules,
      form,
      save,
      hideAreaCreateDialog,
    };
  },
};
</script>
