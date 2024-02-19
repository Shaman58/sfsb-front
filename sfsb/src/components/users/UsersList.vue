<template lang="pug">
    v-list.users-list
        v-list-item
            v-list-item-title
                router-link.list-link(:to="`/staff/new`")
                    div(:style="{color: 'orange'}") Добавить нового пользователя
        v-list-item(v-for='user in filteredStaff', :key='user.id' :active="user.id===page")
            router-link.list-link(:to='`/staff/${user.id}`')
                span {{user.firstName}} {{user.lastName}}
</template>
<script setup lang="ts">
import {storeToRefs} from "pinia";
import {useStaffStore} from "@/pinia-store/staff";
import {computed, toRefs} from "vue";
import {useRoute, useRouter} from "vue-router";

const props = defineProps<{filter?:string}>()
const {filter} = toRefs(props)

const {staff} = storeToRefs(useStaffStore())
const {getAllStaff} = useStaffStore()
!staff.value.length && await getAllStaff()

const router = useRouter();
const {path} = toRefs(useRoute())
const page = computed(() => path.value.split("/").at(-1))

const filteredStaff = computed<Person[]>(()=>staff.value.filter(e=>(e.firstName+" "+e.lastName).toLowerCase().includes(filter.value?.toLowerCase() || "")))


const firstId = computed(() => staff.value.length && staff.value[0].id)
page.value === "staff" && await router.push(`/staff/${firstId.value}`)


</script>


<style scoped lang="sass">
.users-list

    .v-list-item--density-default.v-list-item--one-line
        @media (width < 1024px)
            min-height: 36px
    &__link
        color: inherit
        text-decoration: none
</style>
