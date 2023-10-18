<template>
  <v-dialog v-model="props.visible" width="800" persistent="">
    <v-card>
      <v-container>
        <v-row>
          <v-col v-if="departments" cols="6">
            <v-select label="Отдел"
                      :items="departments"
                      item-title="departmentName"
                      return-object
                      v-model="department"
                      clearable
            />
          </v-col>
        </v-row>
      </v-container>
      <v-list dense>
        <v-list-item v-for="(item, index) in filtered"
                     :key="index"
                     :value="item"
                     :title="item.firstName + ' ' + item.lastName + ' ' + item.position"
                     @click.stop="active=index">
          <template v-slot:append>
            <v-btn color="orange-lighten-1"
                   icon="mdi-delete"
                   variant="text"
                   @click.stop="remove(item)"
            ></v-btn>
          </template>
          <employee-create :visible="active===index"
                           :employee="item"
                           :departments="departments"
                           @hide="active=-1"
                           @save=save($event)
          />
        </v-list-item>
        <v-list-item>
          <v-list-item-title>
            Добавить сотрудника
          </v-list-item-title>
          <template v-slot:append>
            <v-btn color="orange-lighten-1"
                   icon="mdi-plus"
                   variant="text"
                   @click.stop="active='new'"
            ></v-btn>
          </template>
          <employee-create :visible="active==='new'"
                           :employee="{}"
                           :departments="departments"
                           @hide="active=-1"
                           @save=save($event)
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
import {useStore} from "vuex";
import {computed, ref} from "vue";
import EmployeeCreate from "@/components/employee/EmployeeCreate.vue";

const props = defineProps({
  visible: {
    type: Boolean,
    required: true
  },
  employees: {
    type: Object,
    required: true
  },
  departments: {
    type: Object,
    required: false
  }
});

const emit = defineEmits(['hide', 'save', 'remove']);
const store = useStore();

const departments = ref(props.departments);
const employee = ref(null);
const department = ref(null);
const active = ref(null);

const filtered = computed(() => {
  if (department.value) {
    return props.employees.filter((item) => item.department.id === department.value.id);
  } else {
    return props.employees;
  }
});

const hide = (() => {
  department.value = null;
  emit("hide");
});

const save = (data) => {
  emit("save", data);
};

const remove = (data) => {
  emit("remove", data);
};

</script>
