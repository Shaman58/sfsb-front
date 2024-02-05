<template lang="pug">
    .layout-main
        header.layout-main__header
            slot(name="header")
        main.layout-main__main
            slot
        footer.layout-main__footer
            slot(name="footer")

</template>
<script setup lang="ts">
import {useSlots} from "vue";

const slots = useSlots()
const header = slots.header ? "60px" : "0px"
const footer = slots.footer ? "60px" : "0px"
</script>


<style scoped lang="sass">
.layout-main
    --scroll-color: rgba(47, 71, 126, 0.5)
    height: 100%
    display: grid
    grid-template-rows: v-bind("header") 1fr v-bind("footer")

    &__main
        height: 100%
        overflow-y: auto

        &::-webkit-scrollbar
            width: 4px
            background-color: transparent

        &::-webkit-scrollbar-thumb
            width: 4px
            background-color: var(--scroll-color)
            border-radius: 8px

    &__footer, &__header
        display: grid
        place-items: center start

</style>
