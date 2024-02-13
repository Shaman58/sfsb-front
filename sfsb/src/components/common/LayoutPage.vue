<template lang="pug">
    .layout-page
        h1.layout-page__title
            slot(name="title")
        .layout-page__container
            .layout-page__list-filter
                slot(name="filter")
            .layout-page__list
                slot(name="list")
            .layout-page__card
                .layout-page__card-content
                    slot(name="card")
</template>
<script setup lang="ts">
import {toRefs} from "vue";

const props = defineProps<{ background?: string }>()
const {background} = toRefs(props)
const backgroundWithDefault = background.value || "#00acc120"
</script>
<style scoped lang="sass">
.layout-page
    --scroll-color: rgba(47, 71, 126, 0.5)
    padding: 0 1rem 0
    height: calc(100dvh - 2rem)
    display: grid
    grid-template-rows: 80px 1fr
    background: v-bind("backgroundWithDefault")

    &__title
        display: grid
        place-items: center start
        color: #333
        text-shadow: 2px 2px 1px #fff

    &__container
        display: grid
        grid-template-columns: 1fr 4fr
        grid-template-rows: 56px 1fr
        grid-template-areas: "filter card" "list card"
        gap: 0.5rem
        height: 100%
        overflow-y: hidden

    &__filter
        grid-area: filter

    &__list
        grid-area: list
        height: 100%
        overflow-y: auto
        border-radius: 4px

        &::-webkit-scrollbar
            width: 4px
            background-color: transparent

        &::-webkit-scrollbar-thumb
            width: 4px
            background-color: var(--scroll-color)
            border-radius: 8px

    &__card
        grid-area: card
        height: 100%

    &__card-content
        height: 100%
        overflow-y: auto

        &::-webkit-scrollbar
            width: 4px
            background-color: transparent

        &::-webkit-scrollbar-thumb
            width: 4px
            background-color: var(--scroll-color)
            border-radius: 8px

</style>
