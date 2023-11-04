<template>
  <v-dialog v-model="props.visible" width="800" persistent>
    <v-form ref="form"
            v-model="valid"
            @submit.prevent="save(order)"
            style="height: 800px; overflow-y: auto;">
      <v-card title="Заявка">
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="3">
                <v-text-field label="Номер заявки:"
                              v-model="order.applicationNumber"
                              :rules="[rules.required]"
                              maxlength="5"
                ></v-text-field>
              </v-col>
              <v-col cols="9">
                <v-select v-if="customers"
                          :items="customers"
                          :item-title="'companyName'"
                          return-object
                          v-model="order.customer"
                          :rules="[rules.required]"
                          @update:modelValue="order.contact=null"
                          label="Заказчик">
                </v-select>
              </v-col>
              <v-col cols="6">
                <v-select v-if="order.customer && order.customer.contacts"
                          :items="order.customer.contacts"
                          :item-title=getItemText
                          return-object
                          v-model="order.contact"
                          label="Контакт">
                </v-select>
              </v-col>
              <v-col cols="6">
                <v-select v-if="!!props.employees"
                          :items="props.employees"
                          :item-title=getItemText
                          return-object
                          v-model="order.employee"
                          :rules="[rules.required]"
                          label="Менеджер заказа">
                </v-select>
              </v-col>

              <v-row v-if="order.id">

                <v-col cols="12"
                       v-for="(item,index) in order.items"
                       :key="index">
                  <item-card :item="item"
                             :active="active"
                             :index="index"
                             @save="replaceItem($event, index)"
                             @hide="active=-1"
                             @setActive="setActive($event)"
                             @remove="deleteItem(index)"
                             :class="getBackgroundColorClass(item)"/>
                </v-col>
                <v-col cols="12">
                  <item-card :item="{technology: {outsourcedCosts:{amount:0, currency:'RUB'}}}"
                             :active="active"
                             :index="'new'"
                             @save="addItem($event)"
                             @hide="active=-1"
                             @setActive="setActive($event)"/>
                </v-col>

              </v-row>

              <v-col cols="12">
                <v-textarea label="Описание"
                            v-model="order.description">
                </v-textarea>
              </v-col>
              <v-col cols="12">
                <v-textarea label="КП"
                            v-model="order.businessProposal"
                            :rules="[rules.required]">
                </v-textarea>
              </v-col>
              <v-divider/>
            </v-row>
          </v-container>

        </v-card-text>

        <v-card-actions>
          <v-btn @click="previewCommerce(order)" :disabled="kpAvailable">компред</v-btn>
          <v-btn @click="previewToolOrder(order,1,2)" :disabled="kpAvailable">заявка на инструмент</v-btn>
          <v-btn @click="previewPlan1(order)" :disabled="kpAvailable">План 1</v-btn>
          <v-btn @click="previewPlan2(order)" :disabled="kpAvailable">План 2</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="orange-darken-1" variant="text" @click="hide">
            Закрыть
          </v-btn>
          <v-btn color="orange-darken-1" variant="text" type="submit" :disabled="!valid">
            {{ order.id ? 'Изменить' : 'Создать' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>
<script setup>
import {computed, ref} from "vue";
import {useStore} from "vuex";
import {useValidationRules} from "@/mixins/FieldValidationRules";
import ItemCard from "@/components/order/ItemCard.vue";
import {useOfferGenerator} from "@/mixins/OfferGenerator";

const emit = defineEmits();

const props = defineProps({
  order: {
    type: Object,
    required: true
  },
  customers: {
    type: Array,
    required: true
  },
  employees: {
    type: Array,
    required: true
  },
  visible: {
    type: Boolean,
    required: true
  }
});

const store = useStore();
const {rules} = useValidationRules();
const {previewCommerce, previewToolOrder, previewPlan1, previewPlan2} = useOfferGenerator();

const form = ref(null);
const valid = ref(false);
const active = ref(-1);

const order = ref(JSON.parse(JSON.stringify(props.order)));

const getItemText = (item) => `${item.firstName} ${item.lastName} (${item.position})`;

const hide = () => {
  order.value = JSON.parse(JSON.stringify(props.order));
  emit("hide");
};

const save = (data) => {
  if (form.value.validate()) {
    emit("save", data);
    if (!data.id) {
      emit("hide");
    }
  }
};

const addItem = (data) => {
  data.inserted = true;
  order.value.items.push(data);
};

const replaceItem = async (item, index) => {
  order.value.items.splice(index, 1, item);
};

const deleteItem = async (index) => {
  order.value.items.splice(index, 1);
};

const setActive = (data) => {
  active.value = data;
};

const kpAvailable = computed(() => {
  if (order.value.items.length === 0) {
    return true;
  }
  const index = order.value.items.findIndex(item => item.technology.computed === false);
  return index !== -1;
});

const getBackgroundColorClass = (item) => {
  if (!!item?.technology?.computed && item?.technology?.computed) {
    return 'computed';
  } else {
    return 'not-computed';
  }
};

</script>

<style>
.not-computed {
  border: 1px solid #ff7b7b;
  border-radius: 10px;
  margin: 2px;
}

.computed {
  border: 1px solid #97ffa0;
  border-radius: 10px;
  margin: 2px;
}
</style>
