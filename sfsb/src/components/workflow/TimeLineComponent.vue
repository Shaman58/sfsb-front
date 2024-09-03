<template lang="pug">
    .timeline-container
        .hour-line(v-for="(hour, index) in hours"
            :key="index"
            :class="{ even: index % 2 === 0, odd: index % 2 !== 0 }"
            :style="{ width: lineWidth + 'px' }"
        )
</template>

<script setup lang="ts">
const props = defineProps<{ lineWidth: number }>();

const hours = Array.from({ length: 24 }, (_, i) => i);
</script>

<style scoped lang="sass">
.timeline-container
    position: absolute
    top: 0
    left: 0
    height: 100%
    display: flex
    height: 100%
// Высота контейнера для линии


.hour-line
    height: 100%
    border-right: 1px solid black
    // Основная линия

    &.even
        background-color: #e0e0e0
    // Цвет для четных часов */

    &.odd
        background-color: #c0c0c0
// Цвет для нечетных часов */
</style>
