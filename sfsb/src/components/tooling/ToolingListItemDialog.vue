<template>
  <v-dialog v-model="isToolingDialogVisible" width="768">
    <v-form ref="form" v-model="valid" @submit.prevent="save()">
      <v-card>
        <v-card-title>
          <span class="text-h5">Оснастка:</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="4">
                <v-select
                  v-if="availableToolings"
                  label="Выберите оснастку:"
                  :items="availableToolings"
                  :item-title="'toolingName'"
                  return-object
                  v-model="mapItem.tooling"
                  :rules="[rules.required]"
                  @update:modelValue="createNewTooling"
                  :disabled="isToolingDialogFromItem"
                ></v-select>
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
          <v-btn color="orange-darken-1" variant="text" @click="hideToolingCreateDialog">
            Закрыть
          </v-btn>
          <v-btn color="orange-darken-1" variant="text" type="submit" :disabled="!valid">
            Сохранить
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
  <tooling-create-dialog/>
</template>
<script>
import {computed, ref} from "vue";
import {useStore} from "vuex";
import ToolingCreateDialog from "@/components/tooling/ToolingCreateDialog.vue";

export default {
  name: "tooling-list-item-dialog",
  components: {ToolingCreateDialog},


  mounted() {
    this.$store.dispatch("fetchToolings");
  },
  setup() {
    const store = useStore();

    const form = ref(null);
    const valid = ref(false);

    const isToolingDialogVisible = computed(() => store.getters.isToolingDialogVisible);
    const isToolingDialogFromItem = computed(() => store.getters.isToolingDialogFromItem);
    const mapItem = computed(() => store.getters.getMapItem);
    const selectedStore = computed(() => store.getters.getSelectedStore);
    const selectedArea = computed(() => store.getters.getSelectedArea);
    const toolings = computed(() => store.getters.getToolings);

    const rules = {
      required: (value) => !!value || "Обязательное поле",
      minNumbersValidation: value => {
        const pattern = /^[0-9]{1,5}$/
        return pattern.test(value) || 'Неверный формат, введите 1-5 цифр'
      },
    };

    const availableToolings = computed(() => {
      const selectedToolingIds = selectedStore.value.toolings.map((tooling) => tooling.tooling.id);

      const createToolOption = {
        id: undefined,
        toolingName: 'Создать оснастку',
        description: ''
      };

      return [
        ...toolings.value.filter((tooling) => !selectedToolingIds.includes(tooling.id)),
        createToolOption
      ];
    });

    const save = () => {
      if (form.value.validate()) {
        store.commit("updateToolingInStore", mapItem.value);
        store.dispatch("saveStore", {store: selectedStore.value, area: selectedArea.value});
        hideToolingCreateDialog();
      }
    };

    const hideToolingCreateDialog = () => {
      store.commit("setToolingDialogVisible", false);
    };

    const createNewTooling = () => {
      if (!!!mapItem.value.tooling.id) {
        store.commit("setToolingCreateDialogVisible", true)
      }
    };

    return {
      isToolingDialogVisible,
      hideToolingCreateDialog,
      mapItem,
      save,
      valid,
      form,
      rules,
      toolings,
      availableToolings,
      createNewTooling,
      isToolingDialogFromItem
    };
  },
};
</script>
