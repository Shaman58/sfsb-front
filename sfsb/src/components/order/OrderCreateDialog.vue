<template>
  <v-dialog v-model="isDialogVisible" width="768">
    <v-form ref="form" v-model="valid" @submit.prevent="save(order)"
            style="height: 800px; overflow-y: auto;">
      <v-card title="Заявка">
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
                  :item-title="'firstName'"
                  return-object
                  v-model="order.contact"
                  :rules="[rules.required]"
                  label="Контакт">
                </v-select>
              </v-col>
              <v-col cols="6">
                <v-select
                  v-if="!!employees"
                  :items="employees"
                  :item-title="'firstName'"
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
              <v-divider/>
              <v-container v-if="!!order.id">
                <v-col cols="12">
                  <v-form ref="formItem" v-model="validItem" v-on:submit.prevent="saveItem()"
                          label="Добавить позицию">
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
                      <v-dialog v-model="isFilteredVisible" width="300" :persistent="true">
                        <v-form style="height: 150px; overflow-y: auto;">
                          <v-list>
                            <v-list-item
                              v-for="filteredItem in filteredTechnologies"
                              @click="selectItem({technology:filteredItem})">
                              <v-list-item-title>
                                {{ filteredItem.drawingNumber + " " + filteredItem.drawingName }}
                              </v-list-item-title>
                            </v-list-item>
                          </v-list>
                        </v-form>
                      </v-dialog>
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
                          :rules="[rules.required, rules.numberValidate, rules.min]"
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
                      <v-col cols="5">
                        <v-select
                          v-if="!!employees"
                          :items="employees"
                          :item-title="'firstName'"
                          return-object
                          v-model="item.technology.employee"
                          :rules="[rules.required]"
                          label="Назначить технолога">
                        </v-select>
                      </v-col>
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
                        <a @click="selectItem({ technology: {} })" style="color: orange;">
                          новая позиция</a>
                      </div>
                      <v-list>
                        <v-list-item
                          v-for="orderItem in order.items"
                          @click="selectItem({...orderItem})">
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
<script>
import {computed, ref} from "vue";
import {useStore} from "vuex";

export default {
  name: "order-create-dialog",

  setup() {
    const store = useStore();

    const isDialogVisible = computed(() => store.getters.isOrderCreateDialogVisible);
    const order = computed(() => store.getters.getOrder);
    const customers = computed(() => store.getters.getCustomers);
    const employees = computed(() => store.getters.getEmployees);
    const item = computed(() => store.getters.getItem);
    const technologies = computed(() => store.getters.getTechnologies);

    const filteredTechnologies = computed(() => {
      const searchQuery = !!item.value.technology.drawingNumber ? item.value.technology.drawingNumber.toLowerCase() : null;
      return technologies.value.filter((tech) =>
        tech.drawingNumber.toLowerCase().includes(searchQuery)
      ).slice(0, 3);
    });

    const form = ref(null);
    const valid = ref(false);
    const formItem = ref(null);
    const validItem = ref(false);

    const rules = {
      required: (value) => !!value || "Обязательное поле",
      counter: (value) => value.length <= 200 || "Не более 200 символов",
      numberValidate: value => {
        const pattern = /^[0-9]{1,5}$/
        return pattern.test(value) || 'Неверный формат, введите 1-5 цифр'
      },
      min: value => {
        return value > 0 || 'Неверный формат, должно быть больше 0'
      }
    };

    const hideDialog = () => {
      store.commit("setOrderCreateDialog", false);
    };

    const save = () => {
      if (form.value.validate()) {
        store.dispatch("saveOrder", order.value);
      }
    };

    const saveItem = () => {
      store.dispatch("saveItem", {...item.value, order: order.value});
    }

    const selectItem = (item) => {
      store.commit("setItem", item);
    }

    const deleteItem = (item) => {
      store.dispatch("deleteItem", item);
    }

    const isFilteredVisible = computed(() => filteredTechnologies.value.length !== 0 && !!!item.value.technology.id);

    return {
      isDialogVisible,
      order,
      valid,
      rules,
      form,
      formItem,
      validItem,
      hideDialog,
      save,
      customers,
      saveItem,
      item,
      employees,
      selectItem,
      deleteItem,
      technologies,
      filteredTechnologies,
      isFilteredVisible
    };
  },
};
</script>
