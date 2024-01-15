<template lang="pug">
    .mobile-menu(v-if="show" @keyup.esc="close")

        .mobile-menu__nav(@keyup.esc="close" :data-active="showNav")
            .mobile-menu__header
                v-icon.mobile-menu__close(@click="close" icon="mdi-close" color="red")
                .mobile-menu__user(@click="userShow=!userShow")
                    img.mobile-menu__avatar(:src="picture" alt="picture")
                    span {{userName}}
                v-card-item.mobile-menu__user-close(v-if="userShow" )
                    span(@click="exit") ВЫХОД
            .mobile-menu__body
                .mobile-menu__body-wrapper
                    a.mobile-menu__link(v-for="i in CONSTS.MAINMENU" :href="i.path") {{i.label}}
            .mobile-menu__footer {{ version }}

</template>
<script setup lang="ts">
import CONSTS from "@consts/index"
import {defineModel, ref, watch} from "vue"

interface Props {
    userName: string
    picture: any
}

const {userName, picture} = defineProps<Props>()
const emit = defineEmits(["exit"])
const show = defineModel({type: Boolean})
const showNav = ref(true)
const userShow = ref(false)
const version = import.meta.env.VITE_APP_VERSION;

watch([show], () => {
    setTimeout(() => {
        showNav.value = show.value || false
    })
})
const close = () => {
    show.value = false
    userShow.value = false
}
const exit = () => {
    emit("exit")
}

</script>


<style scoped lang="sass">
.mobile-menu
    position: fixed
    z-index: 1005
    inset: 0
    width: 100vw
    height: 100dvh
    background: #0004
    backdrop-filter: blur(4px)

    &__nav
        display: grid
        grid-template-rows: 40px 1fr 40px
        position: absolute
        padding: 2rem
        height: 100dvh
        right: 0
        top: 0
        width: max-content
        background: #fff
        gap: 0.5rem
        translate: 100% 0
        transition: translate 0.5s 0.3s

    &__nav[data-active="true"]
        translate: 0 0

    &__close
        position: fixed
        top: 0.5rem
        left: 0.5rem
        z-index: 3

    &__header
        position: relative

    &__body
        display: grid
        place-items: center start

    &__body-wrapper
        display: flex
        flex-direction: column
        justify-content: flex-start
        gap: 1rem

    &__link
        text-decoration: none
        text-transform: uppercase

    &__footer
        display: grid
        place-items: center

    &__user
        position: relative
        display: flex
        align-items: center
        gap: 0.5rem

    &__user-close
        position: absolute
        display: grid
        place-items: center
        padding: 0.5rem
        z-index: 2
        top: 100%
        left: 50%
        translate: -50% 0

        & span
            color: red

    &__avatar
        width: 30px
        height: 30px
        border-radius: 50%
        object-fit: cover

</style>
