<template lang="pug">
    v-container
        v-app-bar.navbar(color="#2F477E")
            template(#prepend)
                v-btn(:to="'/'")
                    impuls-hub

            span(:style="{color:'white'}" v-if="width>1160") {{ version }}
            v-toolbar-items.ml-5(style="overflow-x: auto;" v-if="width>=1024")
                v-btn(:color="'white'" v-for="navitem in CONSTS.MAINMENU" :key="navitem.path" :to="navitem.path" rounded="xs"
                    tonal :hidden="navitem.role && navitem.role.length && !user?.roles.some(e => navitem.role?.includes(e))")
                    div(v-if="'submenu' in navitem" )
                        div(color="white ") {{ navitem.label }}
                            v-menu(activator="parent" open-on-hover)
                                v-list
                                    v-list-item(v-for="(item, index) in navitem.submenu"  :key="index" :value="index")
                                        router-link.navbar__link(:to="navitem.path+'/'+item.path" variant="tonal" ) {{ item.label }}
                    div(v-else) {{ navitem.label }}

                v-menu(open-on-hover="")
                    template(#activator="{ props }")
                        v-btn(color="white" v-bind="props")
                            .navbar__user-data
                                img.navbar__img(:src="picture || '/images/user-profile.png'" alt="")
                                span.navbar__name( v-if="width>1116") {{ name }}

                    v-list
                        v-list-item(@click="logout" class="d-flex justify-center align-center navbar-exit")
                            span(color="red") ВЫХОД
                            v-icon(icon="mdi-exit-to-app" class="ml-2" color="red")
            v-btn(:color="'white'" v-if="width < 1024" @click="showMobileMenu=true")
                v-icon(icon="mdi-menu")

    mobile-menu(v-model="showMobileMenu" :user-name="name" :picture="picture || '/images/user-profile.png'" @exit="logout")
</template>

<script setup lang="ts">
import {onMounted, ref, watch} from "vue";
import ImpulsHub from "@/components/ImpulsHub.vue";
import CONSTS from "@consts/index"
import keycloakService from '@/plugins/keycloak/service';
import {useToast} from "vue-toast-notification";
import {useCurrentUserStore} from "@/pinia-store/currentUser";
import {storeToRefs} from "pinia";
import useWindowResize from "@/mixins/useWindowResize";
import MobileMenu from "@/components/common/MobileMenu.vue";

const toast = useToast();

const {user} = storeToRefs(useCurrentUserStore())

const version = import.meta.env.VITE_APP_VERSION;


const width = useWindowResize()
const showMobileMenu = ref(false)
watch([width], ([widthVal]) => console.log(widthVal))
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

.navbar-exit
    display: flex
    align-items: center


</style>
