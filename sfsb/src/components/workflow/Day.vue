<template lang="pug">
    .day(:class="{'day-active': isCurrentDay(), small: lineWidth < 6}", :data-day="refresher")
        .day__header
            .long
                strong {{day.toLocaleDateString('ru-RU', {weekday: 'long'})}}
                span &nbsp;{{day.toLocaleDateString()}}
            .short
                strong {{day.toLocaleDateString('ru-RU', {weekday: 'short'})}}
                span &nbsp;{{day.toLocaleDateString().split('.').slice(0, 2).join('.')}}
            .xs
                span &nbsp;{{day.toLocaleDateString().split('.')[0]}}
        .day__container(ref="dayContainer")
            .hour-line(v-for="(hour, index) in hours"
                :key="index"
                :class="{ even: index % 2 === 0, odd: index % 2 !== 0,  'current-day': isCurrentHour(index), small: lineWidth < 6 }"
                :style="{ width: lineWidth + 'px' }"
            )
                .hour-line__caption {{index.toString().padStart(2, '0')}}:00
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from "vue";

const props = defineProps<{ lineWidth: number; day: Date }>();
const dayContainer = ref<HTMLElement>();
defineExpose({ dayContainer });

const refresher = ref(0);
const timer = ref();

const hours = Array.from({ length: 24 }, (_, i) => i);


const isCurrentDay = () => {
    const res = new Date(props.day).getDate() === new Date().getDate()
        && (new Date(props.day).getMonth() === new Date().getMonth())
        && (new Date(props.day).getFullYear() === new Date().getFullYear());
    return res;
};

const isCurrentHour = (index: number) => {
    const res = new Date().getHours() === index
        && new Date(props.day).getDate() === new Date().getDate()
        && (new Date(props.day).getMonth() === new Date().getMonth())
        && (new Date(props.day).getFullYear() === new Date().getFullYear());
    return res;
};

const update = () => {
    refresher.value += 1;
};

onMounted(() => {
    timer.value = setInterval(update, 60000);
});

onUnmounted(() => {
    timer.value && clearInterval(timer.value);
});
</script>

<style scoped lang="sass">
.day
    //border-left: 1px solid black
    //border-right: 1px solid black
    position: relative



    &.small
        &:nth-child(odd)
            background-color: #ccc

        &.day-active::before
            content: ''
            position: absolute
            top: 0
            bottom: 0
            left: 50%
            translate: -50% 0
            width: 6px
            background: red


        .day__header
            &:nth-child(odd)
                background-color: #ccc


    &::after
        content: ''
        position: absolute
        top: 0
        bottom: 0
        left: 0
        width: 1px
        background: #181818


    &__container
        //position: absolute
        //top: 0
        //left: 0
        height: 100%
        display: inline-block
        white-space: nowrap

    &__header
        position: sticky
        top: 0
        z-index: 1
        background: #ddd
        text-align: center
        //width: max-content
        margin: 0 auto 8px
        border-bottom: 1px solid #7777
        container: day-header / inline-size

        &::after
            content: ''
            position: absolute
            top: 0
            bottom: 0
            left: 0
            width: 1px
            background: #181818

        .short, .xs
            display: none


        @container (width <= 240px)
            .long
                display: none
            .short
                display: block
        @container (width <= 120px)
            .short
                strong
                    display: none
        @container (width <= 50px)
            .short
                display: none
            .xs
                display: block
//display: flex
// Высота контейнера для линии


.hour-line
    display: inline-block
    height: 100%
    border-right: 1px solid black
    container: hour / inline-size
    // Основная линия

    @container (width <= 32px)
        .hour-line__caption
            display: none

    &.small:is(.even,.odd)
            background-color: transparent
            border-right-color: transparent

    &__caption
        text-align: center
        font-size: clamp(10px, 10cqw, 18px)

    &.even
        background-color: #e0e0e0
    // Цвет для четных часов */

    &.odd
        background-color: #c0c0c0

    &.current-day
        background-color: red
// Цвет для нечетных часов */
</style>
