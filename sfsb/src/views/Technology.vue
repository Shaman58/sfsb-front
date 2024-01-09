<template>
    <Suspense>
        <template #fallback>
            <div class="technology-view">
                <v-progress-circular indeterminate :size="62" :width="6" color="#2F477E"></v-progress-circular>
            </div>
        </template>
        <technology-dialog />
    </Suspense>
</template>

<script setup lang="ts">
import TechnologyDialog from '@/components/technology/TechnologyDialog.vue';

// import TechnologyComponent from "@/components/technology/TechnologyComponent.vue";

</script>
<style lang="sass" scoped>
.technology-view
    height: 85vh
    display: grid
    place-items: center
</style>
