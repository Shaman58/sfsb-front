<template lang="pug">
    v-card(height="100%" v-if="setup.additionalTools.length !== 0 || setup.additionalComments !== null && setup.additionalComments?.length > 0")
        v-list(density="compact" style="padding: 0;" :lines="false")
            v-list-item(v-for="(tool, index) in setup.additionalTools" :key="index" :title="tool.toolName + ' ' + tool.amount + 'шт.'" :subtitle="formatWorkpieceData(tool.workpiece)")
            v-list-item(:title="setup.additionalComments")
</template>

<script setup lang="ts">
import {toRefs} from "vue";
import materialDataFormatting from "@/mixins/MaterialDataFormatting";

const props = defineProps<{ setup: Setup }>()
const {setup} = toRefs(props)

const {formatWorkpieceData} = materialDataFormatting();
</script>


<style scoped lang="sass">

</style>
