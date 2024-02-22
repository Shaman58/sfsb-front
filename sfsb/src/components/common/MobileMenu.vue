<template lang="pug">
.mobile-menu(v-if="show" @keyup.esc="close" @click="close")

    .mobile-menu__nav(@keyup.esc="close" :data-active="showNav" @click.stop)
        .mobile-menu__header
            v-icon.mobile-menu__close(@click="close" icon="mdi-close" color="red")
            .mobile-menu__user(@click="userShow=!userShow")
                img.mobile-menu__avatar(:src="picture" alt="picture")
                span {{userName}}
            v-card-item.mobile-menu__user-close(v-if="userShow" )
                .mobile-menu__user-close-inner
                    span(@click="exit") ВЫХОД
                    v-icon(icon="mdi-exit-to-app" class="ml-2" color="red")
            ThemeSwitcher
        .mobile-menu__body
            .mobile-menu__body-wrapper
                .mobile-menu__link(v-for="(i, index) in CONSTS.MAINMENU" )
                    div(v-if="'submenu' in i")
                        label.submenu__label(:for="`submenu-switch${index}`")
                            span {{ i.label }}
                            v-icon(icon="mdi:mdi-chevron-down")
                        input.submenu__switcher(:id="`submenu-switch${index}`" type="checkbox" hidden="true")
                        .submenu
                            .submenu__container
                                router-link(v-for="link in i.submenu" :key="link" :to="i.path+'/'+link.path" @click="close") {{ link.label }}

                    router-link(:to="i.path" v-if="!('submenu' in i)" @click="close") {{i.label}}
        router-link.mobile-menu__link(:to="'/support'" @click="close") ТЕХПОДДЕРЖКА
        .mobile-menu__footer {{ version }}

</template>
<script setup lang="ts">
import CONSTS from "@consts/index"
import {defineModel, onUnmounted, ref, toRefs, watch} from "vue"
import ThemeSwitcher from "@/components/common/ThemeSwitcher.vue";

interface Props {
    userName: string
    picture: any
}

const props = defineProps<Partial<Props>>()
const { userName, picture } = toRefs(props)
const emit = defineEmits(["exit"])
const show = defineModel<boolean>()
const showNav = ref(false)
const userShow = ref(false)
const version = import.meta.env.VITE_APP_VERSION;

const lag = 100
const lagcss = lag + 'ms'
const unwatch = watch([show], ([newVal]) => {
    newVal && setTimeout(() => showNav.value = true, lag)
})
const close = () => {
    userShow.value = false
    showNav.value = false
    setTimeout(() => {
        show.value = false
    }, 2 * lag)
}
const exit = () => {
    emit("exit")
}

onUnmounted(unwatch)
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
        background: rgb(var(--v-theme-surface))
        gap: 0.5rem
        translate: 100% 0
        transition: translate 0.5s v-bind('lagcss')

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
        &  a
            text-decoration: inherit
            text-transform: inherit

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
        width: max-content
        display: grid
        place-items: center
        padding: 0 0.5rem 0.5rem
        margin-top: -0.5rem
        z-index: 2
        top: 100%
        left: 50%
        translate: -50% 0

        & span
            color: red

    &__user-close-inner
        display: flex
        gap: .5rem

    &__avatar
        width: 30px
        height: 30px
        border-radius: 50%
        object-fit: cover

.submenu
    display: grid
    grid-template-rows: 0fr
    transition: grid-template-rows 0.5s
    background: rgb(var(--v-theme-surface))

    &__container
        height: 100%
        overflow-y: hidden
        display: flex
        flex-direction: column
        gap: .5rem

    &__switcher:checked + .submenu
        grid-template-rows: 1fr

    &__label
        margin-bottom: 0.5rem
        cursor: pointer


</style>
