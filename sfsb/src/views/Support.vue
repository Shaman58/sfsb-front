<template lang="pug">
.support
    h1.support__title Техническая поддержка по вопросам работы приложения
    .support__description
        p Уважаемые коллеги, данное приложение еще разрабатывается и находится в стадии тестиррования.
        p Нам очень важно получить обратную связь о работе данной программы.
        p Если Вы заметили какие-либо ошибки, неточности, неудобства в работе программы, просим Вас сообщать в телеграмм чат.
        p Для разработчиков - это возможность исправить ошибки и улучшить качество программы
        bh
        p Заранее признательны!
        p.support__signature Разработчики

    .support__container
        .support__support
            img(src="/images/photo_2024-02-13_18-48-23.webp" alt="support image")
</template>
<script setup lang="ts">

</script>


<style scoped lang="sass">
.support
    padding: 4rem
    &__container

        display: grid
        place-items: center

    &__support
        width: 320px
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
