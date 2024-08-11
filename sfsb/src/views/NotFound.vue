<template lang="pug">
    .not-found
        h1.not-found__title 404
        p.not-found__text страница не найдена

</template>

<script setup lang="ts"></script>

<style lang="sass" scoped>
.not-found
    margin-top: 2rem
    height: 50vh
    display: flex
    flex-direction: column
    gap: 1rem
    align-items: center
    justify-content: center

    &__title
        font-size: 10vmax
        background: linear-gradient(45deg, orange, #f702, orange)
        background-clip: text
        color: transparent
        margin: 0
        padding: 0
        line-height: 1

    &__text
        font-size: 2vmax
</style>
