<template lang="pug">
    v-container.technology-dialog

        v-card.technology-dialog__orders.technology-dialog__card
            v-card-title
                span(class="text-h5") Заявки
            v-list
                v-list-item(v-for="i in orders" :key="i.id" @click="currentOrder=i" :class="{'active-order ': i.id === currentOrder?.id}") {{ i.applicationNumber }} {{ i.customer.companyName }}
            v-text-field(label="Поиск по заявкам" v-model="filterText")

        v-card.technology-dialog__technologies.technology-dialog__card
            v-card-title
                span(class="text-h5") Технологии
            v-table
                thead
                    tr
                        th(width="10%") РАСЧИТАН
                        th НОМЕР
                        th НАИМЕНОВАНИЕ
                        th Работает
                tbody
                    tr.technology-dialog__order-item(v-for="i in currentOrder?.items||[]" :key="i.id" @click="setCurrentItem(i)")
                        td(width="10%")
                            v-icon(:icon="i.technology?.computed?'mdi-check-circle':'mdi-radiobox-blank'" )
                        td
                            span {{ i.technology.drawingNumber }}
                        td {{ i.technology.drawingName }}
                        td {{ staffUser(i.technology.blocked) ?staffUser(i.technology.blocked).lastName+" "+staffUser(i.technology.blocked).firstName:"" }}

        v-card.technology-dialog__self.technology-dialog__card
            v-card-title
                span(class="text-h5") У меня в работе:
            v-list
                v-list-item(v-for="i in items||[]" :key="i.id" @click="setCurrentItem(i)")
                    span {{ i.technology.drawingNumber }} {{ i.technology.drawingName }}

        suspended-component
            technology-create-dialog(@close="refresh")
</template>

<script setup lang="ts">
import TechnologyCreateDialog from "@/components/technology/TechnologyCreateDialog.vue";
import {useOrdersStore} from '@/pinia-store/orders';
import {storeToRefs} from 'pinia';
import type {Ref} from 'vue'
import {ref, watchEffect} from 'vue';
import {useCurrentUserStore} from '@/pinia-store/currentUser';
import {useTechnologyStore} from '@/pinia-store/technology';
import {useStaffStore} from '@/pinia-store/staff';
import {useItemStore} from '@/pinia-store/item';
import SuspendedComponent from "@/components/common/SuspendedComponent.vue";

const {orders} = storeToRefs(useOrdersStore())
const {getOrders} = useOrdersStore()
await getOrders()

const {user} = storeToRefs(useCurrentUserStore())

const {dialogVisible, currentItem} = storeToRefs(useTechnologyStore())
const {setCurrentItem} = useTechnologyStore()


const {items} = storeToRefs(useItemStore())
const {fetchItems} = useItemStore()
await fetchItems()

const {staff} = storeToRefs(useStaffStore())
const {getAllStaff} = useStaffStore()
await getAllStaff()

const currentOrder: Ref<Order | null> = ref(orders.value[0] || null)

// const technologiesByUser = computed(() => currentOrder && currentOrder.value?.items.filter(item => item.technology.blocked === user.value?.id))

const staffUser = (uuid: string) => staff.value.find(user => user.id === uuid)

const filterText = ref("")

watchEffect(async () => {
    await getOrders(filterText.value)
    currentOrder.value = orders.value[0] || null
})

const refresh = async () => {
    await fetchItems()
    await getOrders()
    currentOrder.value = orders.value.find(order => order.id == currentOrder.value?.id) || null
}


</script>

<style lang="sass" scoped>
.technology-dialog
    display: grid
    height: 80vh
    grid-template-columns: 1fr 3fr 1fr
    gap: 8px

    &__card
        height: 80vh

    &__order-item
        cursor: pointer
        background-color: #fff
        transition: background-color .5s

        &:hover
            background-color: #f7f7f7

    &__orders
        display: grid
        grid-template-rows: auto 1fr auto


.active-order
    background: #999
    color: #fff
</style>
