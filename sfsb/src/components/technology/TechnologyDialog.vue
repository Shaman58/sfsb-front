<template lang="pug">
v-container.technology-dialog

    v-card.technology-dialog__orders
        v-card-title
            span(class="text-h5") Заявки
        v-list
            v-list-item(v-for="item in orders" :key="item.id" @click="currentOrder=item" :class="{'active-order ': item.id === currentOrder?.id}") {{ item.id }} {{ item.customer.companyName }}


    v-card.technology-dialog__technologies
        v-card-title
            span(class="text-h5") Технологии
        v-list
            v-list-item(v-for="item in currentOrder?.items" :key="item.id" @click="setCurrentTechnology(item.technology)" )
                span {{ item.technology.drawingNumber }} {{ item.technology.drawingName }}


    v-card.technology-dialog__self
        v-card-title
            span(class="text-h5") Мои технологии
        v-list
            v-list-item(v-for="item in items||[]" :key="item.id" @click="setCurrentTechnology(item.technology)")
                span {{ item.technology.drawingNumber }} {{ item.technology.drawingName }}

    <TechnologyCreateDialog @close="refresh"/>
</template>

<script setup lang="ts">
import useCurrentUser from '@/mixins/CurrentUser';
import TechnologyCreateDialog from "@/components/technology/TechnologyCreateDialog.vue";

import { useOrdersStore } from '@/pinia-store/orders';
import { storeToRefs } from 'pinia';
import { computed, ref } from 'vue';
import type { Ref } from 'vue'
import { useCurrentUserStore } from '@/pinia-store/currentUser';
import { useTechnologyStore } from '@/pinia-store/technology';
import { useItemStore } from '@/pinia-store/item';

const { orders } = storeToRefs(useOrdersStore())
const { getOrders } = useOrdersStore()


const { user } = storeToRefs(useCurrentUserStore())

const { dialogVisible, currentTechnology } = storeToRefs(useTechnologyStore())
const { setCurrentTechnology } = useTechnologyStore()

await getOrders()

const { items } = storeToRefs(useItemStore())
const { fetchItems } = useItemStore()

await fetchItems()

const currentOrder: Ref<Order | null> = ref(orders.value[0] || null)

const technologiesByUser = computed(() => currentOrder && currentOrder.value?.items.filter(item => item.technology.blocked === user.value?.id))

const refresh = async () => {
    await getOrders()
    currentOrder.value = orders.value.find(order => order.id == currentOrder.value?.id) || null
}

</script>

<style lang="sass" scoped>
.technology-dialog
    display: grid
    grid-template-columns: repeat(3, 1fr)
.active-order
    text-decoration: underline
</style>
