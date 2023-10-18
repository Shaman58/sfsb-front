<template>
  <v-card v-if="props.active!==props.index"
          @click.stop="setActive"
          style="height: 48px;">
    <v-card-subtitle class="d-flex justify-space-between align-center">
      {{
        Object.keys(item.technology).length === 1
          ? 'Добавить позицию'
          : item.technology.drawingNumber + ' ' + item.technology.drawingName
      }}
      <v-icon v-if="item.customerMaterial"
              color="green">mdi-playlist-minus
      </v-icon>
      <a v-if="Object.keys(item.technology).length !== 1"
         class="ml-auto">{{ item.quantity + ' шт.' }}</a>
      <v-btn v-if="Object.keys(item.technology).length !== 1"
             icon @click.stop="remove"
             color="orange-darken-1" variant="text">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-card-subtitle>
  </v-card>
  <v-card v-else>
    <v-form ref="form"
            v-model="valid"
            v-on:submit.prevent="save()">

      <v-row>
        <v-col cols="4">
          <v-text-field label="Номер чертежа:"
                        v-model="item.technology.drawingNumber"
                        :rules="[rules.required, rules.counter]"
                        maxlength="20"
                        :disabled="!!item.technology.id"
          ></v-text-field>
        </v-col>
        <v-col cols="4">
          <v-text-field label="Название чертежа:"
                        v-model="item.technology.drawingName"
                        :rules="[rules.required, rules.counter]"
                        maxlength="20"
                        :disabled="!!item.technology.id"
          ></v-text-field>
        </v-col>
        <v-col cols="4">
          <v-text-field label="Количество:"
                        v-model="item.quantity"
                        :rules="[rules.required, rules.numberValidate]"
                        type="number"
          ></v-text-field>
        </v-col>
        <v-col cols="3">
          <v-switch v-model="item.customerMaterial"
                    :true-value="true"
                    :false-value="false"
                    :label="item.customerMaterial ? 'Материал заказчика' : 'Наш материал'">
          </v-switch>
        </v-col>
        <v-spacer/>
        <v-col cols="5">
          <v-btn :disabled="!valid"
                 @click="save"
                 color="orange-darken-1" variant="text">
            {{ item.inserted || item.id ? 'Изменить' : 'Добавить' }}
          </v-btn>
          <v-btn @click="hide"
                 color="orange-darken-1" variant="text">
            закрыть
          </v-btn>
        </v-col>
      </v-row>

    </v-form>
  </v-card>
</template>

<script setup>
import {ref, watch} from "vue";
import {useValidationRules} from "@/mixins/FieldValidationRules";

const props = defineProps({
  item: {
    type: Object,
    required: true
  },
  active: {
    type: [Number, String],
    required: true
  },
  index: {
    type: [Number, String],
    required: true
  }
})

const form = ref(null);
const valid = ref(false);
const {rules} = useValidationRules();
const emit = defineEmits();
const item = ref(JSON.parse(JSON.stringify(props.item)));
watch(() => props.item, (newValue) => {
  item.value = JSON.parse(JSON.stringify(newValue));
});

const save = async () => {
  if (form.value.validate()) {
    item.value.technology.computed = false;
    emit("save", item.value);
    hide();
  }
}

const remove = async () => emit("remove");

const hide = () => {
  item.value = JSON.parse(JSON.stringify(props.item));
  emit("hide");
};

const setActive = () => emit("setActive", props.index);

</script>
