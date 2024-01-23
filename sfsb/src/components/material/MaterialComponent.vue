<template lang="pug">
    v-btn(@click="visible = true" color="orange-darken-1" variant="text") Редактировать базу материалов
    suspended-component
        material-list-dialog1(v-model:visible="visible")
</template>

<script setup lang="ts">
import {useStore} from "vuex";
import {ref} from "vue";
// import MaterialListDialog from "@/components/material/MaterialList.vue";
import MaterialListDialog1 from "@/components/material/MaterialList1.vue";
import {useMaterialsStore} from "@/pinia-store/materials.js";
import {useMaterialTemplatesStore} from "@/pinia-store/materialTemplates";
import {storeToRefs} from "pinia";
import SuspendedComponent from "@/components/common/SuspendedComponent.vue";

const {materials} = storeToRefs(useMaterialsStore())
const {fetchMaterials, saveMaterial, deleteMaterial} = useMaterialsStore()
!materials.value.length && await fetchMaterials()

const {materialTemplates: templates} = storeToRefs(useMaterialTemplatesStore())
const {fetchMaterialTemplates} = useMaterialTemplatesStore()
!templates.value.length && await fetchMaterialTemplates()


const visible = ref(false);

const store = useStore();


const save = async (data: Material) => {
    await saveMaterial(data);
};

const remove = async (data) => {
    await deleteMaterial(data);
};

</script>
