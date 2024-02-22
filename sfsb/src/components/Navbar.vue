<template lang="pug">
    v-container
        v-app-bar.navbar(:color="$defaultColor")
            template(#prepend)
                v-btn.navbar__logo(:to="'/'")
                    impuls-hub
            v-spacer
            span.navbar__route {{ $route.meta?.name?.toUpperCase() }}
            v-spacer
            span.navbar__version(:style="{color:'white'}") {{ version }}
            v-toolbar-items.ml-5.navbar__menu(style="overflow-x: auto;")
                .navbar__item
                    router-link.navbar__link(:to="'/support'") ТЕХПОДДЕЖКА
                .navbar__item(v-for="navitem in CONSTS.MAINMENU" :key="navitem.path" :hidden="navitem.role && navitem.role.length && !user?.roles.some(e => navitem.role?.includes(e))")
                    div(v-if="'submenu' in navitem" )
                        div
                            span {{ navitem.label }}
                            v-icon(icon="mdi:mdi-chevron-down" )
                            v-menu(activator="parent"  :open-on-hover="true" content-class="submenu" )
                                v-list.submenu__list
                                    v-list-item.submenu__list-item(v-for="(item, index) in navitem.submenu"  :key="index" :value="index")
                                        router-link.navbar__link(:to="navitem.path+'/'+item.path" variant="tonal" ) {{ item.label }}
                    router-link(:to="navitem.path" v-else) {{ navitem.label }}

                v-menu(open-on-hover="")
                    template(#activator="{ props }")
                        v-btn(color="white" v-bind="props")
                            .navbar__user-data
                                img.navbar__img(:src="picture || '/images/user-profile.png'" alt="")
                                span.navbar__name {{ name }}

                    v-list
                        v-list-item(@click="logout" class="d-flex justify-center align-center navbar-exit")
                            span(color="red") ВЫХОД
                            v-icon(icon="mdi-exit-to-app" class="ml-2" color="red")
                        v-list-item(class="d-flex justify-center align-center")
                            theme-switcher
            v-btn.navbar__burger(:color="'white'"  @click="showMobileMenu=true")
                v-icon(icon="mdi-menu")

    mobile-menu(v-model="showMobileMenu" :user-name="name" :picture="picture || '/images/user-profile.png'" @exit="logout")
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import ImpulsHub from "@/components/ImpulsHub.vue";
import CONSTS from "@consts/index"
import keycloakService from '@/plugins/keycloak/service';
import { useToast } from "vue-toast-notification";
import { useCurrentUserStore } from "@/pinia-store/currentUser";
import { storeToRefs } from "pinia";
import MobileMenu from "@/components/common/MobileMenu.vue";
import { useTheme } from "vuetify";
import { useThemeStore } from "@/pinia-store/themeSwitcher";
import ThemeSwitcher from "@/components/common/ThemeSwitcher.vue";

const toast = useToast();

const { user } = storeToRefs(useCurrentUserStore())

const version = import.meta.env.VITE_APP_VERSION;

const showMobileMenu = ref(false)
const logout = () => {
    keycloakService.logout()
}

const name = ref();
const picture = ref()


onMounted(async () => {
    const user = await keycloakService.keycloak.loadUserProfile()
    picture.value = user.attributes.picture && user.attributes.picture.length > 0 && import.meta.env.VITE_APP_BASE_FS_URL + user.attributes.picture[0]
    name.value = user.firstName + " " + user.lastName
})
</script>

<style lang="sass">
.navbar
    padding: 4px

    &__logout
        background: #fff

    &__user-data
        display: flex
        align-items: center
        gap: 0.5rem
        margin-right: 1.5rem

    &__img
        width: 30px
        height: 30px
        border-radius: 50%
        object-fit: cover

    &__link
        text-decoration: none

    &__menu
        display: flex
        align-items: center
        gap: 1rem

        @media (width < 1024px)
            display: none

    &__logo
        @media (width < 1024px)
            padding: 0

    &__version
        @media (width < 1160px)
            display: none

    &__item
        font-size: clamp(12px, 18 / 1920 * 100vw, 18px)

        & > *
            color: white
            text-decoration: none
            text-transform: uppercase
            cursor: pointer

    &__name
        @media (width < 1116px)
            display: none

    &__burger
        display: none
        @media (width < 1024px)
            display: block

    &__theme-switch
        display: flex
        align-items: center
        gap: 5px

        & .v-input__details
            display: none

    &__route
        display: none
        @media (width < 1024px)
            display: block
            font-size: clamp(12px, 16 / 1024  * 100vw, 16px)

.navbar-exit
    display: flex
    align-items: center

.submenu
    background-color: #2F477E

    &__list-item
        background-color: #2F477E

        & a
            color: #fff

.v-menu > .v-overlay__content > .v-list.submenu__list
    background-color: #2F477E
</style>
