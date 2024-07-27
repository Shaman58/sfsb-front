<template lang="pug">
    v-list.technology-card
        v-list-item(v-for='order in orders', :key='order.id' :active="order.id===+page")
            router-link.list-link.technology-card__link(:to='`/technology/${order.id}`')
                span {{order.applicationNumber}} {{order.customer.companyName}}
        v-list-item(v-intersect="nextPortion" :style="{minHeight: '10px !important'}")
</template>
<script setup lang="ts">
import { storeToRefs } from "pinia";
import { computed, onUnmounted, toRefs, watch, watchEffect } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useOrdersStore } from "@/pinia-store/orders";

const props = defineProps<{ filter: string }>();
const { filter: filterText } = toRefs(props);

const { orders } = storeToRefs(useOrdersStore());
const { getOrders, next } = useOrdersStore();
!orders.value.length && (await getOrders());

const router = useRouter();
const { path } = toRefs(useRoute());
const page = computed(() => path.value.split("/").at(-1));

const filteredOrders = computed<Order[]>(() =>
    orders.value.filter(
        (e) =>
            e.customer.companyName
                .toLowerCase()
                .includes(filterText.value?.toLowerCase() || "") ||
            e.applicationNumber
                .toString()
                .includes(filterText.value?.toLowerCase() || "")
    )
);

const firstId = computed(() => orders.value.length && orders.value[0].id);

const nextPortion = async (ev: Event) => {
    if (!ev) return;
    await next(filterText.value);
};

const unwatch = watch(
    page,
    () => {
        page.value === "technology" &&
            router.push(`/technology/${firstId.value}`);
    },
    { immediate: true }
);
const unwatchFilterText = watchEffect(async () => {
    await getOrders(filterText.value);
});

onUnmounted(() => {
    unwatch();
    unwatchFilterText();
});
</script>

<style scoped lang="sass">
.technology-card

    &__link
        color: inherit
        text-decoration: none
</style>
