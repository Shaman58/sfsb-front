<template lang="pug">
.support
    h1.support__title Техническая поддержка по вопросам работы приложения
    .support__description
        p Уважаемые коллеги, данное приложение еще разрабатывается и находится в стадии тестирования.
        p Кроме того, оно на постоянной основе обновляется ( на данный момент это версия {{ version }}) и дорабатывается.
        | Добавляются новые функциональные возможности. Вместе с этим возможны и новые ошибки в программе.
        p Нам очень важно получить обратную связь о работе данной программы.
        p Если Вы заметили какие-либо ошибки, неточности, неудобства в работе программы, просим Вас сообщать в телеграмм чат.
        p Для разработчиков - это возможность исправить ошибки и улучшить качество программы
        br
        strong Заранее признательны!
        p.support__signature Разработчики

    .support__container
        a.support__support(href="https://t.me/+nw6VUwj3oHA3NjRi")
            img(src="/images/photo_2024-02-13_18-48-23.webp" alt="support image")
</template>
<script setup lang="ts">
const version = import.meta.env.VITE_APP_VERSION
</script>


<style scoped lang="sass">
.support
    padding: max(4rem, 5px)
    &__container

        display: grid
        place-items: center

    &__support
        display: block
        width: min(320px, 100%)
        aspect-ratio: 1

        & > img
            display: block
            width: 100%
            height: 100%

    &__title
        text-align: center

    &__description
        padding: 1rem 0 2rem
        font-size: 1.2rem
        font-family: sans-serif

    &__signature
        text-align: right
        font-style: oblique


</style>
