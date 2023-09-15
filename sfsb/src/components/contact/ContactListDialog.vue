<template>
  <v-dialog v-model="isListDialogVisible" persistent>
    <v-card title="Контакты:">
      <v-list>
        <v-list-item
          v-for="item in customer.contacts"
          :key="item.id"
          :value="item"
          :title="item.firstName + ' ' + item.lastName + ' ' + item.position"
          :subtitle="item.phoneNumber + ' ' + item.email"
          @click="showCreateDialog(item)">
          <template v-slot:append>
            <v-btn
              color="orange-lighten-1"
              icon="mdi-delete"
              variant="text"
              @click.stop="deleteContact(item)"
            ></v-btn>
          </template>
        </v-list-item>
        <v-list-item title="...">
          <template v-slot:append>
            <v-btn
              color="orange-lighten-1"
              icon="mdi-plus"
              variant="text"
              @click="showCreateDialog({customer: customer})"
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
import {useStore} from "vuex";
import {computed} from "vue";

const store = useStore();

const isListDialogVisible = computed(() => store.getters.isListDialogVisible);
const customer = computed(() => store.getters.getSelectedCompany);

const hideDialog = (() => store.commit("setContactListDialogVisible", false));

const showCreateDialog = ((contact) => {
  store.commit("setEmployee", contact);
  store.commit("setEmployeeDialog", true);
});

const deleteContact = (contact) => {
  store.dispatch("deleteContact", contact);
};

</script>
