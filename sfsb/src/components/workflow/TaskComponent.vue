<template lang="pug">
    .task-component
        pre {{task.name}} {{start}} {{end}}
</template>

<script setup lang="ts">
const props = defineProps<{ task: Task; start: number; end: number }>();
</script>

<style scoped lang="sass">
.task-component
    grid-column: v-bind(start) / v-bind(end)
    background-color: #00bcd4
</style>
