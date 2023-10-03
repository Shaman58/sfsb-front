<template>
  <v-dialog v-model="isDialogVisible" width="768" persistent>
    <v-form ref="form" v-model="valid" @submit.prevent="save()"
            style="height: 800px; overflow-y: auto;">
      <v-card
        title="Заявка"
        subtitle="Переработать интерфейс. Понять как сделать проще и логичнее">
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="3">
                <v-text-field
                  label="Номер заявки:"
                  v-model="order.applicationNumber"
                  :rules="[rules.required]"
                  maxlength="5"
                ></v-text-field>
              </v-col>
              <v-col cols="9">
                <v-select
                  v-if="customers"
                  :items="customers"
                  :item-title="'companyName'"
                  return-object
                  v-model="order.customer"
                  :rules="[rules.required]"
                  label="Заказчик">
                </v-select>
              </v-col>
              <v-col cols="6">
                <v-select
                  v-if="!!order.customer"
                  :items="order.customer.contacts"
                  :item-title=getItemText
                  return-object
                  v-model="order.contact"
                  label="Контакт">
                </v-select>
              </v-col>
              <v-col cols="6">
                <v-select
                  v-if="!!employees"
                  :items="employees"
                  :item-title=getItemText
                  return-object
                  v-model="order.employee"
                  :rules="[rules.required]"
                  label="Менеджер заказа">
                </v-select>
              </v-col>
              <v-col cols="12">
                <v-textarea
                  label="Описание"
                  v-model="order.description">
                </v-textarea>
              </v-col>
              <v-col cols="12">
                <v-textarea
                  label="КП"
                  v-model="order.businessProposal">
                </v-textarea>
              </v-col>
              <v-divider/>
              <v-container v-if="!!order.id">
                <v-col cols="12">
                  <v-form ref="formItem" v-model="validItem" v-on:submit.prevent="saveItem()">
                    <v-row>
                      <v-col cols="4">
                        <v-text-field
                          label="Номер чертежа:"
                          v-model="item.technology.drawingNumber"
                          :rules="[rules.required, rules.counter]"
                          maxlength="20"
                          :disabled="!!item.technology.id"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="4">
                        <v-text-field
                          label="Название чертежа:"
                          v-model="item.technology.drawingName"
                          :rules="[rules.required, rules.counter]"
                          maxlength="20"
                          :disabled="!!item.technology.id"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="3">
                        <v-text-field
                          label="Количество:"
                          v-model="item.quantity"
                          :rules="[rules.required, rules.numberValidate]"
                          type="number"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="3">
                        <v-switch
                          v-model="item.customerMaterial"
                          :true-value="true"
                          :false-value="false"
                          :label="item.customerMaterial ? 'Материал заказчика' : 'Наш материал'">
                        </v-switch>
                      </v-col>
                      <!--                      <v-col cols="5">-->
                      <!--                        <v-select-->
                      <!--                          v-if="!!employees"-->
                      <!--                          :items="employees"-->
                      <!--                          :item-title=getItemText-->
                      <!--                          return-object-->
                      <!--                          v-model="item.technology.employee"-->
                      <!--                          :rules="[rules.required]"-->
                      <!--                          label="Назначить технолога">-->
                      <!--                        </v-select>-->
                      <!--                      </v-col>-->
                      <v-spacer/>
                      <v-btn
                        :disabled="!validItem"
                        @click="saveItem">
                        {{ item.id ? 'Изменить' : 'Добавить' }}
                      </v-btn>
                    </v-row>
                  </v-form>
                  <v-card v-if="!!order.items">
                    <v-card-title>
                      <div class="d-flex align-center">
                        <div class="flex-grow-1">Позиции:</div>
                        <a
                          @click="dropItem()"
                          style="color: orange;">
                          новая позиция</a>
                      </div>
                      <v-list>
                        <v-list-item
                          v-for="orderItem in order.items"
                          @click="selectItem({...orderItem})"
                          :class="getBackgroundColorClass(orderItem)"
                        >
                          <v-list-item-title>
                            <div class="d-flex align-center">
                              <div class="flex-grow-1">
                                {{ orderItem.technology.drawingNumber + " " + orderItem.technology.drawingName }}
                              </div>
                              <a>{{ orderItem.quantity + " шт." }}</a>
                            </div>
                          </v-list-item-title>
                          <template v-slot:append>
                            <v-btn
                              color="orange-lighten-1"
                              icon="mdi-delete"
                              variant="text"
                              @click.stop="deleteItem(orderItem)"
                            ></v-btn>
                          </template>
                        </v-list-item>
                      </v-list>
                    </v-card-title>
                  </v-card>
                </v-col>
              </v-container>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-btn @click="previewCommerce" :disabled="kpAvailable">Вывести компред</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="orange-darken-1" variant="text" @click="hideDialog">
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
<script setup>
import {computed, ref} from "vue";
import {useStore} from "vuex";
import api from "@/api/instance";
import {useValidationRules} from "@/mixins/FieldValidationRules";
import mammoth from 'mammoth';


const store = useStore();
const {rules} = useValidationRules();
const isDialogVisible = computed(() => store.getters.isOrderCreateDialogVisible);
const order = computed(() => store.getters.getOrder);
const customers = computed(() => store.getters.getCustomers);
const employees = computed(() => store.getters.getEmployees);
const item = computed(() => store.getters.getItem);
const technologies = computed(() => store.getters.getTechnologies);
const kpAvailable = computed(() => {
  if (order.value.items.length === 0) {
    return true;
  }
  const index = order.value.items.findIndex(item => item.technology.computed === false);
  return index !== -1;
});

const form = ref(null);
const valid = ref(false);
const formItem = ref(null);
const validItem = ref(false);

const hideDialog = () => {
  store.commit("setOrderCreateDialog", false);
};

const save = () => {
  if (form.value.validate()) {
    store.dispatch("saveOrder", order.value);
    store.commit("setOrderCreateDialog", false);
  }
};

const saveItem = async () => {
  if (formItem.value.validate()) {
    item.value.technology.computed = false;
    await store.dispatch("saveItem", {
      ...item.value,
      order: order.value
    });
    await store.dispatch("fetchOrder", order.value);
  }
}

const selectItem = (item) => {
  store.commit("setItem", item);
  validItem.value = !!formItem.value.validate()
}

const dropItem = () => {
  store.commit("setItem", {
    technology: {
      drawingName: undefined,
      drawingNumber: undefined,
      outsourcedCosts: {amount: 0, currency: 'RUB'}
    }
  });
  validItem.value = false;
}

const deleteItem = async (item) => {
  await store.dispatch("deleteItem", item);
  await store.dispatch("fetchOrder", order.value);
}

const getBackgroundColorClass = (item) => {
  if (!!item?.technology?.computed && item?.technology?.computed) {
    return 'computed';
  } else {
    return 'not-computed';
  }
};

const getItemText = (item) => `${item.firstName} ${item.lastName} (${item.position})`;

const previewCommerce = async () => {
  try {
    const response = await api.get("/doc/kp", {
      params: {orderId: order.value.id},
      responseType: 'arraybuffer'
    });

    const arrayBuffer = response.data;
    const result = await mammoth.convertToHtml({arrayBuffer: arrayBuffer});
    const blob = new Blob([response.data], {type: response.headers['content-type']});
    const objectURL = URL.createObjectURL(blob);
    const filename = order.value.customer.companyName + "_" + order.value.applicationNumber + '.docx';

    const downloadButtonHtml = `
      <a href="${objectURL}" download="${filename}" style="display: block; margin: 20px;">
        Скачать
      </a>
    `;

    const newWindow = window.open("", "_blank");
    newWindow.document.write(downloadButtonHtml);
    newWindow.document.write(result.value);
    newWindow.document.close();
  } catch (error) {
    console.error("There was an error previewing the DOCX file:", error);
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
