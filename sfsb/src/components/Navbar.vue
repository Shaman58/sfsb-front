<template>
    <v-container>
        <v-app-bar color="orange" class="navbar">
            <template v-slot:prepend>

                <v-btn :to="'/'">
                    <impuls-hub />
                </v-btn>
            </template>

            {{ version }}
            <v-toolbar-items class="ml-5" style="overflow-x: auto;">

                <v-btn v-for="navitem in CONSTS.MAINMENU" :key="navitem.path" :to="navitem.path" rounded="xs" tonal
                    :hidden="navitem.role && !user?.roles.some(e => e === navitem.role)">
                    {{ navitem.label }}
                </v-btn>
                <v-menu open-on-hover>
                    <template v-slot:activator="{ props }">
                        <v-btn color="primary" v-bind="props">
                            <div class="navbar__user-data">
                                <img class="navbar__img" :src="picture" alt="avatar" />
                                <span class="navbar__name">{{ name }}</span>
                            </div>
                        </v-btn>
                    </template>

                    <v-list>
                        <v-list-item @click="logout" class="d-flex justify-center align-center navbar-exit">
                            <span color="red">ВЫХОД</span>
                            <v-icon icon="mdi-exit-to-app" class="ml-2" color="red"></v-icon>
                        </v-list-item>
                    </v-list>
                </v-menu>
            </v-toolbar-items>
        </v-app-bar>
    </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import ImpulsHub from "@/components/ImpulsHub.vue";
import CONSTS from "@consts/index"
import keycloakService from '@/plugins/keycloak/service';
import { useToast } from "vue-toast-notification";
import { useCurrentUserStore } from "@/pinia-store/currentUser";
import { storeToRefs } from "pinia";

const toast = useToast();

const { user } = storeToRefs(useCurrentUserStore())

const version = import.meta.env.VITE_APP_VERSION;

const logout = () => keycloakService.logout()

const name = ref();
const picture = ref()

onMounted(async () => {
    const user = await keycloakService.keycloak.loadUserProfile()
    picture.value = import.meta.env.VITE_APP_BASE_FS_URL + user.attributes.picture[0]
    name.value = user.firstName + " " + user.lastName
})
</script>

<style lang="sass" >
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

.navbar-exit
    display: flex
    align-items: center


</style>
