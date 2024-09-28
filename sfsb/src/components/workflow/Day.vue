<template lang="pug">
    .day
        .day__header {{day.toLocaleDateString()}}
        .day__container(ref="dayContainer")
            .hour-line(v-for="(hour, index) in hours"
                :key="index"
                :class="{ even: index % 2 === 0, odd: index % 2 !== 0 }"
                :style="{ width: lineWidth + 'px' }"
            )
                .hour-line__caption {{index.toString().padStart(2, '0')}}:00
</template>

<script setup lang="ts">
import { ref } from "vue";

const props = defineProps<{ lineWidth: number; day: Date }>();
const dayContainer = ref<HTMLElement>();
defineExpose({ dayContainer });

const hours = Array.from({ length: 24 }, (_, i) => i);
</script>

<style scoped lang="sass">
.day
    border-left: 1px solid black
    border-right: 1px solid black

    &__container
        //position: absolute
        //top: 0
        //left: 0
        height: 100%
        display: inline-block
        white-space: nowrap

    &__header
        text-align: center
//display: flex
// Высота контейнера для линии


.hour-line
    display: inline-block
    height: 100%
    border-right: 1px solid black
    container: hour / inline-size
    // Основная линия

    &__caption
        text-align: center
        font-size: clamp(10px, 10cqw, 18px)

    &.even
        background-color: #e0e0e0
    // Цвет для четных часов */

    &.odd
        background-color: #c0c0c0
// Цвет для нечетных часов */
</style>
