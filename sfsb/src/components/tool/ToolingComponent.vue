<template>
    <v-btn @click="visible=true"
           color="orange-darken-1" variant="text">
        Редактировать базу оснастки
    </v-btn>
    <tool-list v-if="toolings && toolings.length"
               :visible="visible"
               :tools="toolings"
               :loading="loading"
               @hide="visible=false"
               @save="save($event)"
               @remove="remove($event)"
    />

</template>

<script setup lang="ts">
import {useStore} from "vuex";
import {onMounted, ref} from "vue";
import ToolList from "@/components/tool/ToolList.vue";
import {storeToRefs} from "pinia";
import {useToolingStore} from "@/pinia-store/tooling";

onMounted(() => {
    store.dispatch("fetchToolings");
});

const visible = ref(false);

const store = useStore();

// const toolings = computed(() => store.getters.getToolings);

const {toolings, loading} = storeToRefs(useToolingStore())
const {saveToolings, fecthToolings, deleteTooling} = useToolingStore()

await fecthToolings()
const save = async (data: Tool) => {
    // store.dispatch("saveTooling", data);
    await saveToolings(data)
};

const remove = async (data: Tool) => {
    // store.dispatch("deleteTooling", data);
    await deleteTooling(data)
};

</script>
