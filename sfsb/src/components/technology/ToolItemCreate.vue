<template>
  <v-dialog v-model="props.visible" persistent>
    <v-card>
      <v-form ref="form" v-model="valid" @submit.prevent="save(toolItem)">
        <v-card-title>
          <span class="text-h5">{{ props.title }}:</span>
        </v-card-title>
        <v-card-text>

          <v-container v-if="toolItems.length!==0">
            <v-list>
              <v-list-item
                v-for="(tool, index) in toolItems"
                :key="index"
                :title="tool.tool.toolName +'   '+ tool.tool.description"
                :subtitle="tool.amount +'шт.'">
                <template v-slot:append>
                  <v-btn
                    color="orange-lighten-1"
                    icon="mdi-delete"
                    variant="text"
                    @click.stop="remove(index)"
                  ></v-btn>
                </template>
              </v-list-item>
            </v-list>
          </v-container>

          <v-container>
            <v-row>
              <v-col cols="4">
                <v-text-field
                  label="Фильтр"
                  v-model="filter">
                </v-text-field>
              </v-col>
              <v-col cols="4">
                <v-select
                  :items="filteredTools"
                  item-title='toolName'
                  return-object
                  :label='props.title'
                  v-model="toolItem.tool"
                  :rules="[rules.required]">
                </v-select>
              </v-col>
              <v-col cols="4">
                <v-text-field
                  label="Количество:"
                  v-model="toolItem.amount"
                  :rules="[rules.required, rules.counter]"
                  counter
                  type="number"
                  maxlength="20">
                </v-text-field>
              </v-col>
              <v-col cols="4">
                <v-text-field
                  label="Ориентировочная стоимость:"
                  v-model="toolItem.price.amount"
                  :rules="[rules.required, rules.counter]"
                  counter
                  type="number"
                  maxlength="20">
                </v-text-field>
              </v-col>
            </v-row>
          </v-container>

        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="orange-darken-1" variant="text" @click="hide">
            Закрыть
          </v-btn>
          <v-btn color="orange-darken-1" variant="text" type="submit" :disabled="!valid">
            Добавить
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script setup>
import {computed, getCurrentInstance, reactive, ref} from "vue";
import {useValidationRules} from "@/mixins/FieldValidationRules";

// ---- ПРОПСЫ ----
const props = defineProps({
  title: {
    type: String,
    required: true
  },
  visible: {
    type: Boolean,
    required: true
  },
  tools: {
    type: Array,
    required: true
  },
  toolItems: {
    type: Array,
    required: true,
    default: [{
      tool: Object,
      amount: Number
    }]
  }
});

const {rules} = useValidationRules();
const {emit} = getCurrentInstance();
const form = ref(null);
const valid = ref(false);
const filter = ref('');
const toolItem = ref({price: {currency: 'RUB'}});
const filteredTools = computed(() => {
  return props.tools.filter(toolItem => {
    // Проверяем, что элемент не добавлен в toolItems
    const isAdded = toolItems.some(item => item.tool.toolName === toolItem.toolName && item.tool.description === toolItem.description);

    // Проверяем, что элемент соответствует критериям фильтра
    const isMatch = toolItem.toolName.toLowerCase().includes(filter.value.toLowerCase()) ||
      toolItem.description.toLowerCase().includes(filter.value.toLowerCase());

    return isMatch && !isAdded;
  });
});

const toolItems = reactive(props.toolItems);

const hide = () => {
  emit('hide');
};

const save = (savedTool) => {
  toolItems.push({...savedTool});
  toolItem.value = {cutterTool: {}, amount: 0, price: {currency: 'RUB'}};
};

const remove = (index) => {
  toolItems.splice(index, 1);
};

</script>
