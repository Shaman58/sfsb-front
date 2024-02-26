<template lang="pug">
    //--- DESKTOP ---
    v-card.table
        v-progress-linear(v-if="loading" indeterminate :color="$defaultColor")
        v-table
            thead
                tr
                    th(width="10%") РАСЧИТАН
                    th НОМЕР
                    th НАИМЕНОВАНИЕ
                    th Работает
            tbody
                tr.table__order-item(v-for="i in items||[]" :key="i.id" @click="emit('select',i)")
                    td(width="10%")
                        v-icon(:icon="i.technology?.computed?'mdi-check-circle':'mdi-radiobox-blank'" )
                    td
                        span {{ i.technology.drawingNumber }}
                    td {{ i.technology.drawingName }}
                    td {{ staffUser(i.technology.blocked) ?staffUser(i.technology.blocked).lastName+" "+staffUser(i.technology.blocked).firstName:"" }}
    //--- MOBILE ---
    v-list.table-mobile
        v-progress-linear(v-if="loading" indeterminate :color="$defaultColor")
        v-list-item.table-mobile__item(v-for="i in items||[]" :key="i.id" @click="emit('select',i)")
            .table-mobile__row
                span.table-mobile__key РАСЧИТАН:
                v-icon(:icon="i.technology?.computed?'mdi-check-circle':'mdi-radiobox-blank'" )
            .table-mobile__row
                span.table-mobile__key НОМЕР:
                span.table-mobile__value {{ i.technology.drawingNumber }}
            .table-mobile__row
                span.table-mobile__key НАИМЕНОВАНИЕ:
                span.table-mobile__value {{ i.technology.drawingName }}
            .table-mobile__row
                span.table-mobile__key РАБОТАЕТ:
                span.table-mobile__value {{ staffUser(i.technology.blocked) ?staffUser(i.technology.blocked).lastName+" "+staffUser(i.technology.blocked).firstName:""  }}
</template>
<script setup lang="ts">

import {toRefs} from "vue";
import {storeToRefs} from "pinia";
import {useStaffStore} from "@/pinia-store/staff";

const props = defineProps<{ items: Item[], loading: boolean }>()
const {items} = toRefs(props)

const emit = defineEmits(["select"])

const {staff} = storeToRefs(useStaffStore())
const {getAllStaff} = useStaffStore()
!staff.value.length && await getAllStaff()
const staffUser = (uuid: string) => staff.value.find(user => user.id === uuid)

const refresh = () => {
}
</script>


<style scoped lang="sass">
.table
    height: 100%
    overflow-y: auto

    @media (width < 1024px)
        display: none

    &::-webkit-scrollbar
        width: 4px
        background-color: transparent

    &::-webkit-scrollbar-thumb
        width: 4px
        background-color: var(--scroll-color)
        border-radius: 8px

    &__order-item
        cursor: pointer

.table-mobile
    display: none
    padding: .5em

    @media (width < 1024px)
        display: grid
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr))
        gap: .5em

    &__item
        padding: 1em
        background: #fff
        border-radius: .5em
        box-shadow: 0 0 .4em #7774

    &__row

        & > * + *
            margin-left: .5em

    &__key
        color: rgb(var(--v-theme-secondary))

    &__value
        font-weight: 600
</style>
