<template lang="pug">
v-container.technology-dialog

    v-card.technology-dialog__orders.technology-dialog__card
        v-card-title
            span(class="text-h5") Заявки
        v-list
            v-list-item(v-for="item in orders" :key="item.id" @click="currentOrder=item" :class="{'active-order ': item.id === currentOrder?.id}") {{ item.id }} {{ item.customer.companyName }}



    v-card.technology-dialog__technologies.technology-dialog__card
        v-card-title
            span(class="text-h5") Технологии
        v-table
            thead
                tr
                    th(width="10%") РАСЧИТАН
                    th НОМЕР
                    th НАИМЕНОВАНИЕ
            tbody
                tr.technology-dialog__order-item(v-for="item in currentOrder?.items" :key="item.id" @click="setCurrentItem(item)")
                    td(width="10%")
                        v-icon(:icon="item.technology?.computed?'mdi-check-circle':'mdi-radiobox-blank'" )
                    td
                        span {{ item.technology.drawingNumber }}
                    td {{ item.technology.drawingName }}

    v-card.technology-dialog__self.technology-dialog__card
        v-card-title
            span(class="text-h5") У меня в работе:
        v-list
            v-list-item(v-for="item in items||[]" :key="item.id" @click="setCurrentItem(item)")
                span {{ item.technology.drawingNumber }} {{ item.technology.drawingName }}

    <TechnologyCreateDialog @close="refresh"/>
</template>

<script setup lang="ts">
import TechnologyCreateDialog from "@/components/technology/TechnologyCreateDialog.vue";

import { useStore } from 'vuex';
import { useOrdersStore } from '@/pinia-store/orders';
import { storeToRefs } from 'pinia';
import { computed, onMounted, ref } from 'vue';
import type { Ref } from 'vue'
import { useCurrentUserStore } from '@/pinia-store/currentUser';
import { useTechnologyStore } from '@/pinia-store/technology';
import { useItemStore } from '@/pinia-store/item';

const { orders } = storeToRefs(useOrdersStore())
const { getOrders } = useOrdersStore()


const { user } = storeToRefs(useCurrentUserStore())

const { dialogVisible, currentItem } = storeToRefs(useTechnologyStore())
const { setCurrentItem } = useTechnologyStore()

await getOrders()

const { items } = storeToRefs(useItemStore())
const { fetchItems } = useItemStore()

await fetchItems()

const currentOrder: Ref<Order | null> = ref(orders.value[0] || null)

const technologiesByUser = computed(() => currentOrder && currentOrder.value?.items.filter(item => item.technology.blocked === user.value?.id))

const refresh = async () => {
    await fetchItems()
    currentOrder.value = orders.value.find(order => order.id == currentOrder.value?.id) || null
}
//--- LEGASY ---
const store = useStore();
onMounted(() => {
    store.dispatch("fetchMaterials");
    store.dispatch("fetchToolings");
    store.dispatch("fetchSpecials");
    store.dispatch("fetchCutters");
    store.dispatch("fetchItems");
    store.dispatch("fetchOperations");
});

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


.active-order
    background: #999
    color: #fff
</style>
