<template>
  <v-dialog v-model="isSpecialDialogVisible" width="768">
    <v-form ref="form" v-model="valid" @submit.prevent="save()">
      <v-card>
        <v-card-title>
          <span class="text-h5">Специнструмент:</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="4">
                <v-select
                  v-if="availableSpecials"
                  label="Выберите инструмент:"
                  :items="availableSpecials"
                  :item-title="'toolName'"
                  return-object
                  v-model="mapItem.specialTool"
                  :rules="[rules.required]"
                  @update:modelValue="createNewSpecial"
                  :disabled="isSpecialDialogFromItem">
                </v-select>
              </v-col>
              <v-col cols="4">
                <v-text-field
                  label="Количество:"
                  v-model="mapItem.amount"
                  :rules="[rules.required, rules.minNumbersValidation]"
                  counter
                  maxlength="40"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="orange-darken-1" variant="text" @click="hideSpecialCreateDialog">
            Закрыть
          </v-btn>
          <v-btn color="orange-darken-1" variant="text" type="submit" :disabled="!valid">
            Сохранить
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
  <special-create-dialog/>
</template>
<script>
import {computed, ref} from "vue";
import {useStore} from "vuex";
import SpecialCreateDialog from "@/components/special/SpecialCreateDialog.vue";

export default {
  name: "special-tool-list-item-dialog",
  components: {SpecialCreateDialog},
  mounted() {
    this.$store.dispatch("fetchSpecials");
  },
  setup() {
    const store = useStore();

    const form = ref(null);
    const valid = ref(false);

    const isSpecialDialogVisible = computed(() => store.getters.isSpecialDialogVisible);
    const isSpecialDialogFromItem = computed(() => store.getters.isSpecialDialogFromItem);
    const mapItem = computed(() => store.getters.getMapItem);
    const selectedStore = computed(() => store.getters.getSelectedStore);
    const selectedArea = computed(() => store.getters.getSelectedArea);
    const specials = computed(() => store.getters.getSpecials);

    const rules = {
      required: (value) => !!value || "Обязательное поле",
      minNumbersValidation: value => {
        const pattern = /^[0-9]{1,5}$/
        return pattern.test(value) || 'Неверный формат, введите 1-5 цифр'
      },
    };

    const availableSpecials = computed(() => {
      const selectedSpecialIds = selectedStore.value.specialTools.map((special) => special.specialTool.id);

      const createToolOption = {
        id: undefined,
        toolName: 'Создать специнструмент',
        description: ''
      };

      return [
        ...specials.value.filter((special) => !selectedSpecialIds.includes(special.id)),
        createToolOption
      ];
    });

    const save = () => {
      if (form.value.validate()) {
        store.commit("updateSpecialInStore", mapItem.value);
        store.dispatch("saveStore", {store: selectedStore.value, area: selectedArea.value});
        hideSpecialCreateDialog();
      }
    };

    const hideSpecialCreateDialog = () => {
      store.commit("setSpecialDialogVisible", false);
    };

    const createNewSpecial = () => {
      if (!!!mapItem.value.specialTool.id) {
        store.commit("setSpecialCreateDialogVisible", true)
      }
    };

    return {
      isSpecialDialogVisible,
      hideSpecialCreateDialog,
      mapItem,
      save,
      valid,
      form,
      rules,
      specials,
      availableSpecials,
      createNewSpecial,
      isSpecialDialogFromItem
    };
  },
};
</script>
