<template lang="pug">
    v-card(height="100%" v-if="setup.cutterToolItems.length !== 0 || setup.specialToolItems.length !== 0")
        v-list(density="compact" style="padding: 0;" :lines="false")
            v-list-item(v-for="(tool, index) in setup.cutterToolItems" :key="index" :title="tool.tool.toolName + ' ' + tool.amount + 'шт.'" :subtitle="tool.tool.description")
        v-list(density="compact" style="padding: 0;" :lines="false")
            v-list-item(v-for="(tool, index) in setup.specialToolItems" :key="index" :title="tool.tool.toolName + ' ' + tool.amount + 'шт.'" :subtitle="tool.tool.description")
</template>

<script setup lang="ts">
import {toRefs} from "vue";

const props = defineProps<{ setup: Setup }>()
const {setup} = toRefs(props)
</script>


<style scoped lang="sass">

</style>
