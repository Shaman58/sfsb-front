<template>
  <v-dialog v-model="props.visible" width="800" persistent>
    <v-card title="Контрагенты:">
      <v-list>
        <v-list-item v-for="(item, index) in props.customers"
                     :key="index"
                     :title="item.companyName"
                     @click.stop="active=index">

          <template v-slot:append>
            <v-btn color="orange-lighten-1"
                   icon="mdi-delete"
                   variant="text"
                   :disabled="item.contacts && item.contacts?.length !== 0"
                   @click.stop="remove(item)"
            ></v-btn>
          </template>

          <company-create-dialog :visible="active===index"
                                 :company="item"
                                 @hide="active=-1"
                                 @save="save($event)"
                                 @remove="remove($event)"
                                 @saveContact="saveContact($event)"
                                 @removeContact="removeContact($event)"
          />

        </v-list-item>
        <v-list-item title="...">
          <template v-slot:append>
            <v-btn color="orange-lighten-1"
                   icon="mdi-plus"
                   variant="text"
                   @click.stop="active='new'"
            ></v-btn>
          </template>

          <company-create-dialog :visible="active==='new'"
                                 :company="{}"
                                 @hide="active=-1"
                                 @save="save($event)"
                                 @remove="remove($event)"
                                 @saveContact="saveContact($event)"
                                 @removeContact="removeContact($event)"
          />

        </v-list-item>
      </v-list>
      <v-card-actions>
        <v-spacer/>
        <v-btn color="orange-darken-1"
               variant="text"
               @click="hide">
          Закрыть
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import {ref} from "vue";
import {useStore} from "vuex";
import CompanyCreateDialog from "@/components/company/CompanyCreateDialog.vue";

const props = defineProps({
  customers: {
    type: Array,
    required: true
  },
  visible: {
    type: Boolean,
    required: true
  }
});

const emit = defineEmits();
const store = useStore();
const active = ref(null);

const remove = (data) => {
  emit("remove", data);
};

const hide = () => {
  emit("hide");
};

const save = (data) => {
  emit("save", data);
};

const saveContact = (data) => {
  emit("saveContact", data);
};

const removeContact = (data) => {
  emit("removeContact", data);
};

</script>
