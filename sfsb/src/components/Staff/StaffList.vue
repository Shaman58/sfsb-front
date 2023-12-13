
import { format } from 'path';

import { spawn } from 'child_process';

import { log } from 'console';

<template lang="pug">
v-container
    v-card
        v-list
            v-list-item.person(v-for="person in items" :key="person.id" @click="edit(person.id)")
                template(#prepend)
                    img.person__img(:src="person.prependAvatar" alt="person")
                .person__right
                    h3.person__title {{ person.firstName }} {{ person.lastName }}
                    .person__hidden
                        div
                            .person__links
                                a.person__link(href="`mailto:${person.email}`")
                                    v-icon mdi-email
                                    span {{ person.email }}
                                a.person__link(href="`tel:${person.phoneNumber}`")
                                    v-icon mdi-phone
                                    span {{ person.phoneNumber }}
                            div.person__roles
                                span.person__role(v-for="role in person.roles") {{ role }}

    v-dialog(v-model="show")
        v-card
            staff-card(:person="editingPerson" @exit="show=false")
</template>

<script setup lang="ts">
import {ref} from "vue"
import type {Ref} from "vue"
import StaffCard from "./StaffCard.vue"
import Items from "./fakePersonalData"

const items = Items as Person[]

const show = ref(false)
const editingPerson: Ref<Person | undefined> = ref(undefined)

const edit = (id: number) => {
  show.value = true
  editingPerson.value = items.find(person => person.id === id)
}
</script>

<style lang="sass" scoped>
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
        border-radius: 50%
        box-shadow: 0 0 0 #7777
        scale: 1
        transition: box-shadow 0.5s, scale 0.5s


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
