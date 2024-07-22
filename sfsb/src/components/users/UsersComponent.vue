<template lang="pug">
    LayoutPage.users(:background="'#BB00C120'")
        template(#title) {{ $route.meta.name }}
        template(#filter)
            v-text-field(label="фильтр" v-model="filterText" clearable)
        template(#list)
            suspended-component
                users-list(:filter="filterText")
        template(#card)
            suspended-component
                router-view(#default="{Component, route}")
                    transition(name="fade")
                        div.transition-div(:key="route.params.id" :data-route="route.params.id")
                            component(:is="Component")
</template>
<script setup lang="ts">
import LayoutPage from "@/components/common/LayoutPage.vue";
import UsersList from "@/components/users/UsersList.vue";
import SuspendedComponent from "@/components/common/SuspendedComponent.vue";
import {ref} from "vue";

const filterText = ref("")
</script>
<style scoped lang="sass">
.fade-enter-active, .fade-leave-active
    transition: all 0.5s ease

.fade-enter-from, .fade-leave-to
    opacity: 0
    translate: 100% 0
</style>
