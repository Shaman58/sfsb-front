<template>
  <v-dialog v-model="isMaterialDialogVisible">
    <v-card :title=formatObjectData(material)>
      <v-form ref="form" v-model="valid" @submit.prevent="save()">
        <v-card-text>
          <v-row>
            <v-col cols="4">
              <v-text-field
                label="Название:"
                v-model="material.materialName"
                :rules="[rules.required, rules.nameValidation]"
                counter>
              </v-text-field>
            </v-col>
            <v-col cols="4">
              <v-select
                label="Выберите вид:"
                :items="geometries"
                item-text="title"
                item-value="label"
                v-model="material.geometry"
                :rules="[rules.required]">
              </v-select>
            </v-col>
            <v-col cols="4">
              <v-text-field
                label="Гост:"
                v-model="material.gost">
              </v-text-field>
            </v-col>
          </v-row>
          <v-card-actions>
            <v-spacer/>
            <v-btn
              color="orange-darken-1"
              variant="text"
              @click="hideNewMaterialDialog">
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

<script>
import {useStore} from "vuex";
import {computed, ref} from "vue";
import materialDataFormatting from '@/mixins/MaterialDataFormatting'

export default {
  name: "material-create-dialog",

  setup() {

    const store = useStore();

    const form = ref(null);
    const valid = ref(false);
    const {formatObjectData, geometries} = materialDataFormatting();

    const isMaterialDialogVisible = computed(() => store.getters.getMaterialDialogVisible);
    const material = computed(() => store.getters.getMaterial);

    const hideNewMaterialDialog = (() => {
      store.commit("setMaterialDialogVisible", false);
    });

    const rules = {
      required: (value) => !!value || "Обязательное поле",
      counter: (value) => value.length <= 200 || "Не более 200 символов",
      nameValidation: (value) => value.length >= 3 || "Минимальное количество символов: 3",
      numeric: (value) => !isNaN(value) || "Введите число",
    };

    const save = () => {
      if (form.value.validate()) {
        store.dispatch("saveMaterial", material.value);
        hideNewMaterialDialog();
      }
    };

    return {
      isMaterialDialogVisible,
      hideNewMaterialDialog,
      material,
      valid,
      rules,
      form,
      formatObjectData,
      geometries,
      save
    };
  },
}
</script>
