<template lang="pug">
    v-list
        v-list-item
            v-list-item-title
                router-link.list-link(:to="`/staff/new`")
                    div(:style="{color: 'orange'}") Добавить нового пользователя
        v-list-item(v-for='user in staff', :key='user.id')
            router-link(:to='`/staff/${user.id}`')
                span {{user.firstName}} {{user.lastName}}
</template>
<script setup lang="ts">
import {storeToRefs} from "pinia";
import {useStaffStore} from "@/pinia-store/staff";
import {computed, toRefs} from "vue";
import {useRoute, useRouter} from "vue-router";

const {staff} = storeToRefs(useStaffStore())
const {getAllStaff} = useStaffStore()
!staff.value.length && await getAllStaff()

const router = useRouter();
const {path} = toRefs(useRoute())
const page = computed(() => path.value.split("/").at(-1))

const firstId = computed(() => staff.value.length && staff.value[0].id)
page.value === "staff" && await router.push(`/staff/${firstId.value}`)


</script>


<style scoped lang="sass">

</style>
