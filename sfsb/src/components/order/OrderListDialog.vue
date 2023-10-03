<template>
  <v-dialog v-model="isDialogVisible" width="800" persistent>
    <v-card>
      <v-card-title>
        <span class="text-h5">Заявки</span>
      </v-card-title>
      <v-list density="compact">
        <v-list-item
          v-for="item in orders"
          :key="item.id"
          :value="item"
          :title="`№${item.applicationNumber} ${item.customer.companyName}`"
          @click.stop="showCreateDialog(item)">
          <template v-slot:append>
            <v-btn
              color="orange-lighten-1"
              icon="mdi-delete"
              variant="text"
              :disabled="item.items.length!==0"
              @click.stop="deleteOrder(item)"
            ></v-btn>
          </template>
        </v-list-item>
        <v-list-item title="...">
          <template v-slot:append>
            <v-btn
              color="orange-lighten-1"
              icon="mdi-plus"
              variant="text"
              @click.stop="showCreateDialogNewOrder"
            ></v-btn>
          </template>
        </v-list-item>
      </v-list>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="orange-darken-1" variant="text" @click="hideDialog">Закрыть</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import {computed} from "vue";
import {useStore} from "vuex";

const store = useStore();

const orders = computed(() => store.getters.getOrders);
const isDialogVisible = computed(() => store.getters.isOrderDialogVisible);

const hideDialog = () => {
  store.commit("setOrdersListDialog", false);
};

const showCreateDialog = (order) => {
  store.commit("setOrder", order);
  store.commit("setOrderCreateDialog", true);
};

const showCreateDialogNewOrder = () => {
  const appNumber = orders.value.reduce((max, item) => {
    return item.applicationNumber > max ? item.applicationNumber : max
  }, 0);
  store.commit("setOrder", {applicationNumber: appNumber + 1, items: []});
  store.commit("setOrderCreateDialog", true);
};

const deleteOrder = (order) => {
  store.dispatch("deleteOrder", order);
}

</script>
