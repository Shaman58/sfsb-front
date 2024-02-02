<template lang="pug">
    .layout-page
        h1.layout-page__title
            slot(name="title")
        .layout-page__container
            slot.layout-page__list-filter(name="filter")
            slot.layout-page__list(name="list")
            .layout-page__card
                v-card.layout-page__card-content
                    slot(name="card")
</template>
<script setup lang="ts">
</script>
<style scoped lang="sass">
.layout-page
    padding-inline: 1rem
    height: calc(100% - 2rem)
    display: grid
    grid-template-rows: 50px 1fr

    &__title
        margin-bottom: 1rem

    &__container
        display: grid
        grid-template-columns: 1fr 3fr
        grid-template-rows: 56px auto
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
            background-color: #777
            border-radius: 8px

    &__card
        grid-area: card

    &__card-content
        height: 100%
</style>
