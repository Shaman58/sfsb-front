<template>
    <Suspense>
        <template #fallback> Loading ...</template>
        <technology-dialog />
    </Suspense>
</template>

<script setup lang="ts">
import TechnologyDialog from '@/components/technology/TechnologyDialog.vue';

// import TechnologyComponent from "@/components/technology/TechnologyComponent.vue";



</script>
