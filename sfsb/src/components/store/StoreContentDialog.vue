<template>
  <v-container>
    <v-dialog v-model="isStoreContentDialogVisible" width="800">
      <v-card>
        <v-card-title v-if="!!selectedStore.id">
          <span class="text-h5">{{ selectedStore.storeName }}</span>
        </v-card-title>

        <v-list v-if="!!selectedStore.id">

          <v-list-group>
            <template v-slot:activator="{ props }">
              <v-list-item
                v-bind="props"
                title="Режущий инструмент"
                :subtitle="`${selectedStore.cutterTools.length} поз.`"/>
            </template>

            <v-list-item
              v-for="(item,i) in selectedStore.cutterTools"
              :key="i"
              :value="item"
              @click.stop="showCutterItemDialog({...item})"
              :title="`${item.cutterTool.toolName} ${item.cutterTool.description}`"
              :subtitle="`${item.amount}шт.`">
              <template v-slot:append v-if="item.amount===0">
                <v-btn
                  color="orange-lighten-1"
                  icon="mdi-delete"
                  variant="text"
                  @click.stop="deleteCutter(item)"/>
              </template>
            </v-list-item>

            <v-list-item title="...">
              <template v-slot:append>
                <v-btn
                  color="orange-lighten-1"
                  icon="mdi-plus"
                  variant="text"
                  @click.stop="showCutterNewItemDialog({})"/>
              </template>
            </v-list-item>
          </v-list-group>

          <v-list-group>
            <template v-slot:activator="{ props }">
              <v-list-item
                v-bind="props"
                title="Меритель"
                :subtitle="`${selectedStore.measureTools.length} поз.`"/>
            </template>

            <v-list-item
              v-for="(item,i) in selectedStore.measureTools"
              :key="i"
              :value="item"
              @click.stop="showMeasureItemDialog({...item})"
              :title="`${item.measureTool.toolName} ${item.measureTool.description}`"
              :subtitle="`${item.amount}шт.`">
              <template v-slot:append v-if="item.amount===0">
                <v-btn
                  color="orange-lighten-1"
                  icon="mdi-delete"
                  variant="text"
                  @click.stop="deleteMeasure(item)"
                />
              </template>
            </v-list-item>
            <v-list-item title="...">
              <template v-slot:append>
                <v-btn
                  color="orange-lighten-1"
                  icon="mdi-plus"
                  variant="text"
                  @click.stop="showMeasureNewItemDialog({})"/>
              </template>
            </v-list-item>
          </v-list-group>

          <v-list-group>
            <template v-slot:activator="{ props }">
              <v-list-item
                v-bind="props"
                title="Заготовки"
                :subtitle="`${selectedStore.workpieces.length} поз.`"/>
            </template>

            <v-list-item
              v-for="(item,i) in selectedStore.workpieces"
              :key="i"
              :value="item"
              :title="formatObjectData(item.workpiece)"
              @click.stop="showWorkpieceItemDialog({...item})"
              :subtitle="`${item.amount}шт.`">
              <template v-slot:append v-if="item.amount===0">
                <v-btn
                  color="orange-lighten-1"
                  icon="mdi-delete"
                  variant="text"
                  @click.stop="deleteWorkpiece(item)"/>
              </template>
            </v-list-item>
            <v-list-item title="...">
              <template v-slot:append>
                <v-btn
                  color="orange-lighten-1"
                  icon="mdi-plus"
                  variant="text"
                  @click.stop="showWorkpieceNewItemDialog({})"/>
              </template>
            </v-list-item>
          </v-list-group>

          <v-list-group>
            <template v-slot:activator="{ props }">
              <v-list-item
                v-bind="props" title="Специнструмент"
                :subtitle="`${selectedStore.specialTools.length} поз.`"/>
            </template>

            <v-list-item
              v-for="(item,i) in selectedStore.specialTools"
              :key="i"
              :value="item"
              :title="`${item.specialTool.toolName}`"
              @click.stop="showSpecialItemDialog({...item})"
              :subtitle="`${item.amount}шт.`">
              <template v-slot:append v-if="item.amount===0">
                <v-btn
                  color="orange-lighten-1"
                  icon="mdi-delete"
                  variant="text"
                  @click.stop="deleteSpecial(item)"/>
              </template>
            </v-list-item>
            <v-list-item title="...">
              <template v-slot:append>
                <v-btn
                  color="orange-lighten-1"
                  icon="mdi-plus"
                  variant="text"
                  @click.stop="showSpecialNewItemDialog({})"/>
              </template>
            </v-list-item>
          </v-list-group>

          <v-list-group>
            <template v-slot:activator="{ props }">
              <v-list-item
                v-bind="props"
                title="Оснастка"
                :subtitle="`${selectedStore.toolings.length} поз.`"/>
            </template>

            <v-list-item
              v-for="(item,i) in selectedStore.toolings"
              :key="i"
              :value="item"
              :title="`${item.tooling.toolingName} ${item.tooling.description}`"
              @click.stop="showToolingItemDialog({...item})"
              :subtitle="`${item.amount}шт.`">
              <template v-slot:append v-if="item.amount===0">
                <v-btn
                  color="orange-lighten-1"
                  icon="mdi-delete"
                  variant="text"
                  @click.stop="deleteTooling(item)"/>
              </template>
            </v-list-item>
            <v-list-item title="...">
              <template v-slot:append>
                <v-btn
                  color="orange-lighten-1"
                  icon="mdi-plus"
                  variant="text"
                  @click.stop="showToolingNewItemDialog({})"/>
              </template>
            </v-list-item>
          </v-list-group>

          <cutter-tool-list-item-dialog/>
          <measure-tool-list-item-dialog/>
          <tooling-list-item-dialog/>
          <special-tool-list-item-dialog/>
          <workpiece-list-item-dialog/>

        </v-list>

        <v-form v-else ref="form" v-model="valid" @submit.prevent="save()">
          <v-card>
            <v-card-title>
              <span class="text-h5">Создать склад</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12">
                    <v-text-field
                      label="Задайте название склада"
                      v-model="selectedStore.storeName"
                      :rules="[rules.minValidation]"
                      counter
                      maxlength="20"/>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer/>
              <v-btn
                color="orange-darken-1"
                variant="text"
                type="submit"
                :disabled="!valid">
                Сохранить
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-form>

        <v-card-actions>
          <v-spacer/>
          <v-btn color="orange-darken-1" variant="text" @click.stop="hideStoreContentDialog">Закрыть</v-btn>
        </v-card-actions>

      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import {useStore} from "vuex";
import {computed, ref} from "vue";
import CutterToolListItemDialog from "@/components/cutter/CutterToolListItemDialog.vue";
import MeasureToolListItemDialog from "@/components/measure/MeasureToolListItemDialog.vue";
import ToolingListItemDialog from "@/components/tooling/ToolingListItemDialog.vue";
import SpecialToolListItemDialog from "@/components/special/SpecialToolListItemDialog.vue";
import WorkpieceListItemDialog from "@/components/workpiece/WorkpieceToolListItemDialog.vue";

export default {
  name: "store-content-dialog",
  components: {
    WorkpieceListItemDialog,
    SpecialToolListItemDialog, ToolingListItemDialog, MeasureToolListItemDialog, CutterToolListItemDialog
  },
  setup() {
    const store = useStore();

    const form = ref(null);
    const valid = ref(false);

    const rules = {
      minValidation: (value) => value.length >= 3 || "Минимальное количество символов: 3",
    };

    const isStoreContentDialogVisible = computed(() => store.getters.isStoreContentDialogVisible);
    const selectedStore = computed(() => store.getters.getSelectedStore);
    const selectedArea = computed(() => store.getters.getSelectedArea);

    const formatObjectData = (data) => {
      const {geometry, geom1, geom2, geom3, material: {materialName}} = data;

      let shape = '';
      let dimensions = '';

      switch (geometry) {
        case 'CYLINDER':
          shape = 'Круг';
          dimensions = `Ф${geom1}х${geom2}`;
          break;
        case 'TUBE':
          shape = 'Труба';
          dimensions = `Ф${geom1}ф${geom2}х${geom3}`;
          break;
        case 'BLANK':
          shape = 'Плита';
          dimensions = `${geom1}х${geom2}х${geom3}`;
          break;
        default:
          break;
      }

      return `${shape} ${materialName} ${dimensions}`;
    };

    const save = () => {
      if (form && form.value && form.value.validate()) {
        store.dispatch("saveStore", {
          store: selectedStore.value,
          area: selectedArea.value
        });
      }
    };

    const deleteCutter = (item) => {
      const tempStore = selectedStore.value;
      tempStore.cutterTools = selectedStore.value.cutterTools
        .filter(cutter => cutter.cutterTool.id !== item.cutterTool.id);
      store.dispatch("saveStore", {
        store: tempStore,
        area: selectedArea.value
      });
    }

    const deleteMeasure = (item) => {
      const tempStore = selectedStore.value;
      tempStore.measureTools = selectedStore.value.measureTools
        .filter(measure => measure.measureTool.id !== item.measureTool.id);
      store.dispatch("saveStore", {
        store: tempStore,
        area: selectedArea.value
      });
    }

    const deleteTooling = (item) => {
      const tempStore = selectedStore.value;
      tempStore.toolings = selectedStore.value.toolings
        .filter(tooling => tooling.tooling.id !== item.tooling.id);
      store.dispatch("saveStore", {
        store: tempStore,
        area: selectedArea.value
      });
    }

    const deleteSpecial = (item) => {
      const tempStore = selectedStore.value;
      tempStore.specialTools = selectedStore.value.specialTools
        .filter(special => special.specialTool.id !== item.specialTool.id);
      store.dispatch("saveStore", {
        store: tempStore,
        area: selectedArea.value
      });
    }

    const deleteWorkpiece = (item) => {
      const tempStore = selectedStore.value;
      tempStore.workpieces = selectedStore.value.workpieces
        .filter(workpiece => workpiece.workpiece.id !== item.workpiece.id);
      store.dispatch("saveStore", {
        store: tempStore,
        area: selectedArea.value
      });
    }

    const hideStoreContentDialog = () => {
      store.commit("setStoreContentDialogVisible", false);
    };

    const showCutterItemDialog = (item) => {
      store.commit("setCutterDialogFromItem", true)
      store.commit("setMapItem", item)
      store.commit("setCutterDialogVisible", true);
    };

    const showCutterNewItemDialog = (item) => {
      store.commit("setCutterDialogFromItem", false)
      store.commit("setMapItem", item)
      store.commit("setCutterDialogVisible", true);
    };

    const showMeasureItemDialog = (item) => {
      store.commit("setMeasureDialogFromItem", true)
      store.commit("setMapItem", item)
      store.commit("setMeasureDialogVisible", true);
    };

    const showMeasureNewItemDialog = (item) => {
      store.commit("setMeasureDialogFromItem", false)
      store.commit("setMapItem", item)
      store.commit("setMeasureDialogVisible", true);
    };

    const showToolingItemDialog = (item) => {
      store.commit("setToolingDialogFromItem", true)
      store.commit("setMapItem", item)
      store.commit("setToolingDialogVisible", true);
    };

    const showToolingNewItemDialog = (item) => {
      store.commit("setToolingDialogFromItem", false)
      store.commit("setMapItem", item)
      store.commit("setToolingDialogVisible", true);
    };

    const showSpecialItemDialog = (item) => {
      store.commit("setSpecialDialogFromItem", true)
      store.commit("setMapItem", item)
      store.commit("setSpecialDialogVisible", true);
    };

    const showSpecialNewItemDialog = (item) => {
      store.commit("setSpecialDialogFromItem", false)
      store.commit("setMapItem", item)
      store.commit("setSpecialDialogVisible", true);
    };

    const showWorkpieceItemDialog = (item) => {
      store.commit("setWorkpieceDialogFromItem", true)
      store.commit("setMapItem", item)
      store.commit("setWorkpieceDialogVisible", true);
    };

    const showWorkpieceNewItemDialog = (item) => {
      store.commit("setWorkpieceDialogFromItem", false)
      store.commit("setMapItem", item)
      store.commit("setWorkpieceDialogVisible", true);
    };

    return {
      isStoreContentDialogVisible,
      hideStoreContentDialog,
      showCutterItemDialog,
      showCutterNewItemDialog,
      showMeasureItemDialog,
      showMeasureNewItemDialog,
      showToolingItemDialog,
      showToolingNewItemDialog,
      showSpecialItemDialog,
      showSpecialNewItemDialog,
      showWorkpieceItemDialog,
      showWorkpieceNewItemDialog,
      selectedStore,
      formatObjectData,
      save,
      form,
      valid,
      rules,
      deleteCutter,
      deleteMeasure,
      deleteTooling,
      deleteSpecial,
      deleteWorkpiece
    };
  },
}
</script>
