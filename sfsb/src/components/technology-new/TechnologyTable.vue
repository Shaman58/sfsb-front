<template lang="pug">
    v-card.table
        v-table
            thead
                tr
                    th(width="10%") РАСЧИТАН
                    th НОМЕР
                    th НАИМЕНОВАНИЕ
                    th Работает
            tbody
                tr.technology-dialog__order-item(v-for="i in items||[]" :key="i.id" @click="emit('select',i)")
                    td(width="10%")
                        v-icon(:icon="i.technology?.computed?'mdi-check-circle':'mdi-radiobox-blank'" )
                    td
                        span {{ i.technology.drawingNumber }}
                    td {{ i.technology.drawingName }}
                    td {{ staffUser(i.technology.blocked) ?staffUser(i.technology.blocked).lastName+" "+staffUser(i.technology.blocked).firstName:"" }}

</template>
<script setup lang="ts">

import {toRefs} from "vue";
import {storeToRefs} from "pinia";
import {useStaffStore} from "@/pinia-store/staff";

const props = defineProps<{ items: Item[] }>()
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

    &::-webkit-scrollbar
        width: 4px
        background-color: transparent

    &::-webkit-scrollbar-thumb
        width: 4px
        background-color: var(--scroll-color)
        border-radius: 8px
</style>
