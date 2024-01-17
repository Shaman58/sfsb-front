<template lang="pug">
    v-btn(@click="visible=true" color="orange-darken-1" variant="text") Редактировать базу инструмента
    tool-list(v-if="cutters && cutters.length" :visible="visible" :loading="loading" :tools="cutters" @hide="visible=false"  @save="save" @remove="remove")
</template>

<script setup lang="ts">
// import {useStore} from "vuex";
import {ref} from "vue";
import ToolList from "@/components/tool/ToolList.vue";
import {useCuttersStore} from "@/pinia-store/cutters";
import {storeToRefs} from "pinia";

const {cutters, loading} = storeToRefs(useCuttersStore())
const {saveCutter, fetchCutters, deleteCutter} = useCuttersStore()

await fetchCutters()

// onMounted(() => {
//   store.dispatch("fetchCutters");
// });

const visible = ref(false);

// const store = useStore();

// const cutters = computed(() => store.getters.getCutters);

const save = async (data: Tool) => await saveCutter(data);

const remove = async (data: Tool) => await deleteCutter(data);


</script>
