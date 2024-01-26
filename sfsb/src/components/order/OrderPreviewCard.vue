<template lang="pug">
    v-card.mx-auto( max-width="400")
        v-list(dense)
            v-list-subheader Управление заявками
            v-list-item(v-for="(item, index) in lastOrders" :key="index" :value="item" :title="`№${item.applicationNumber} ${item.customer.companyName}`" color="primary")
            v-list-item
                v-list-item-title ...
</template>
<script setup lang="ts">
import {computed} from "vue";

const {orders} = defineProps<{ orders: Order[] }>();

const lastOrders = computed(() => {
    return [...orders].sort((a: Order, b: Order) => {
        const aDate = a.updated || a.created;
        const bDate = b.updated || b.created;
        return new Date(bDate).getDate() - new Date(aDate).getDate();
    }).slice(0, 3);
});

console.log("lastOrders", lastOrders)

</script>
