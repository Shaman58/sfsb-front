<template lang="pug">
    v-card
        v-card-title
            span {{ "№" + setup.setupNumber + " " + setup.operation.operationName }}
            p(v-if="setup.group && Number(currentItem.technology.quantityOfPartsFromWorkpiece) !== 1") Групповая
        v-card-item {{ compactInfo(setup) }}
        v-list(
            density="compact"
            style="padding: 0;"
            :lines="false"
            v-if="!!setup.toolings && setup.operation.operationTimeManagement !== 'COMPUTED' && setup.operation.operationTimeManagement !== 'NONE'")
            v-list-item(v-for="tooling in setup.toolings" :title="tooling.toolName")
</template>
<script setup lang="ts">
import {toRefs} from "vue";
import {storeToRefs} from "pinia";
import {useTechnologyStore} from "@/pinia-store/technology";

const props = defineProps<{ setup: Setup }>()
const {setup} = toRefs(props)

const {currentItem} = storeToRefs(useTechnologyStore());

const compactInfo = (data: Setup) => {
    if (data.operation?.operationTimeManagement === 'COMPUTED'
        || data.operation?.operationTimeManagement === 'PROCESS_TIME_ONLY') {
        return `Обработка: ${data.processTime}`
    } else if (data.operation?.operationTimeManagement === 'FULL') {
        return `Обработка: ${data.processTime} Наладка: ${data.setupTime} Межоперационка: ${data.interoperativeTime}`
    } else {
        return '';
    }
};
</script>


<style scoped lang="sass">

</style>
