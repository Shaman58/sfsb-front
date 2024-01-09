<template lang="pug">
//- v-progress-linear(v-if="!items.length", indeterminate, color="blue")
v-container
    .title
        slot(name="title")
        v-btn.title__icon(@click="edit('-1')", color="orange-lighten-1", icon="mdi-plus", variant="text", title="Добавьте нового пользователя")
    v-card
        v-list
            v-list-item.person(v-for="person in items" :key="person.id" @click="edit(person.id)")
                template(#prepend)
                    img.person__img(:src="person.picture ? person.picture : '/images/user-profile.png'" alt="person")
                .person__right
                    h3.person__title {{ person.firstName }} {{ person.lastName }}
                    .person__hidden
                        div
                            .person__links
                                a.person__link(href="`mailto:${person.email}`", v-if="person.email")
                                    v-icon mdi-email
                                    span {{ person.email }}
                                a.person__link(href="`tel:${person.phoneNumber}`", v-if="person.phoneNumber")
                                    v-icon mdi-phone
                                    span {{ person.phoneNumber }}
                            div.person__roles
                                span.person__role(v-for="role in availableRolesByPerson(person)") {{ role }}

    v-dialog(v-model="show")
        v-card
            StaffCard(:person="editingPerson" @exit="show=false")
</template>

<script setup lang="ts">
import {computed, ref} from "vue"
import type {Ref} from "vue"
import StaffCard from "./StaffCard.vue"
import {useStaffStore} from "@/pinia-store/staff"
import {storeToRefs} from "pinia"
// import DefaultAvatar from "@/assets/default-avatar.png"
import { useRolesStore } from '@/pinia-store/roles'

const rolesStore = useRolesStore();
const { getAllRoles} = rolesStore

await getAllRoles()

const {roles} = storeToRefs(rolesStore)

const staffStore = useStaffStore()

const {staff: itemsRaw} = storeToRefs(staffStore)
const {getAllStaff} = staffStore

await getAllStaff()

const items = computed(() => itemsRaw.value.map(person => ({...person, roles: Array.isArray(person.roles)? person.roles : [person.roles] })))

const show = ref(false)
const editingPerson: Ref<Person | undefined> = ref(undefined)

const edit = (id: string) => {
  show.value = true
  if(id==="-1"){
    editingPerson.value = newPerson()
  } else {
      editingPerson.value = items.value.find(person => person.id === id)
  }
}


const availableRolesByPerson =(person: Person) => {
    return person.roles.filter(r=>roles.value.includes(r))
}

const newPerson = (): Person => {
    return {
        id: "",
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        roles: [],
        picture: "",
        username: "",
        password: ""
    }
}
</script>

<style lang="sass" scoped>
.title
    display: flex
    align-items: center
    justify-content: space-between
    margin-bottom: 1rem

    &__icon
        cursor: pointer

.person
    padding: 0.5rem
    display: flex
    align-items: center
    height: 110px

    &:hover
        .person__hidden
            grid-template-rows: 1fr

        .person__img
            box-shadow: 0 0 0.5rem #7777
            scale: 1.2

    &__right
        padding-left: 1rem
        display: flex
        flex-direction: column
        gap: 0.5rem

    &__hidden
        display: grid
        grid-template-rows: 0fr
        transition: grid-template-rows .5s

        & > div
            overflow: hidden

    &__roles
        display: flex
        gap: 0.5rem
        padding-top: .5rem
        border-top: 1px solid #eee

    &__role
        color: #777

    &__img
        width: 60px
        height: 60px
        box-shadow: 0 0 0 #7777
        border-radius: 50%
        scale: 1
        transition: box-shadow 0.5s, scale 0.5s
        object-fit: cover


    &__links
        display: flex
        gap: 0.5rem

    &__link
        color: #777
        transition: color 0.5s
        display: flex
        gap: 0.5rem
        text-decoration: none

        &:hover
            color: blue


</style>
