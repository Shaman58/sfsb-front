<template lang="pug">
    .datapage-tabs
        router-view

</template>

<script setup lang="ts">

</script>


<style scoped lang="sass">
.fade-enter-active, .fade-leave-active
    transition: opacity .5s

.fade-enter-from, .fade-leave-to
    opacity: 0

.datapage-tabs
    --top: 0px
    margin-top: var(--top)
    height: calc(100dvh - 42px)
    overflow-y: auto
    background-color: rgba(174, 174, 231, 0.3)

    &__container
        margin-inline: 1rem
        height: 100%

    //display: grid
    //grid-template-rows: 50px 1fr

    &__switches
        display: flex
        justify-content: center
        gap: 0.5rem

    &__main
        height: min(520px, 100%)
        //overflow-y: auto
        margin-top: 1rem
        display: grid
        grid-template-columns: 1fr 4fr
        gap: .5rem

    &__list-container
        display: grid
        grid-template-rows: 50px 1fr
        overflow-y: auto
        gap: 1rem

    &__list
        border-radius: 4px

        &::-webkit-scrollbar
            width: 4px
            background-color: transparent

        &::-webkit-scrollbar-thumb
            width: 4px
            background-color: #777
            border-radius: 8px

    &__list-name
        font-size: 1.1rem
        font-weight: 700

    &__list-options
        margin-top: 0.5rem
        display: flex
        gap: .5rem
        flex-wrap: wrap

    &__list-option
        font-weight: 200
        font-size: 0.9rem

    &__card
        height: 100%

    &__card-content
        height: 100%


</style>
