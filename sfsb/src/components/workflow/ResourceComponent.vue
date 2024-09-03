<template lang="pug">
    .resource
        task-component(v-for="task in props.resource.tasks" :key="task.id"  :task)
</template>

<script setup lang="ts">
import TaskComponent from "@/components/workflow/TaskComponent.vue";

const props = defineProps<{ resource: Resource }>();
</script>

<style scoped lang="sass">
.resource
    position: relative
    height: 60px
    width: 100%
    background-color: #fff2
    backdrop-filter: blur(2px)
    margin-block: 4px
    box-shadow: 8px 8px 18px #0003, 8px 8px 6px #fff6 inset
</style>
