<template>
  <v-container>

    <department-preview-card v-if="departments && departments.length"
                             @click.stop="visible=true"
                             :departments="departments"/>

    <employee-list v-if="departments && departments.length"
                   :employees="employees"
                   :visible="visible"
                   :departments="departments"
                   @hide="visible=false"
                   @save="save($event)"
                   @remove="remove($event)"
    />

  </v-container>
</template>

<script setup>
import DepartmentPreviewCard from "@/components/employee/DepartmentPreviewCard.vue";
import {computed, onMounted, ref} from "vue";
import {useStore} from "vuex";
import EmployeeList from "@/components/employee/EmployeeList.vue";

onMounted(() => {
  store.dispatch('fetchDepartments');
  store.dispatch("fetchEmployees");
});

const store = useStore();

const visible = ref(false);

const employees = computed(() => store.getters.getEmployees);
const departments = computed(() => store.getters.getDepartments);

const save = async (data) => {
  await store.dispatch("saveEmployee", data);
};

const remove = (data) => {
  store.dispatch("deleteEmployee", data);
};

</script>
