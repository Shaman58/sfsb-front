<template lang="pug">
    LayoutPage.orders
        template(#title) Заявки
        template(#filter)
            v-text-field(label="фильтр" v-model="filterText" clearable)
        template(#list)
            v-list.orders__list
                v-list-item(@click="()=>{}" :active="id==='new'")
                    router-link.list-link.orders__link(:to="'/commerce/orders/new'")
                        span(:style="{color:'orange'}") Добавить новый заказ
                v-list-item(
                    v-for="i in orders"
                    :key="i.id"
                    :active="+id===i.id"
                    @click="()=>{}"
                    @keyup.space="router.push(`/commerce/orders/${i.id}`)"
                )
                    router-link.list-link.orders__link(:to="`/commerce/orders/${i.id}`") {{i.applicationNumber}} {{i.customer.companyName}}

                v-list-item(v-intersect="nextPortion" :style="{minHeight: '10px !important'}")
        template(#card)
            router-view

</template>
<script setup lang="ts">
import { storeToRefs } from "pinia";
import { computed, onUnmounted, ref, toRefs, watchEffect } from "vue";
import LayoutPage from "@/components/common/LayoutPage.vue";
import { useOrdersStore } from "@/pinia-store/orders";
import { useRoute, useRouter } from "vue-router";

const router = useRouter();

const { orders, loading } = storeToRefs(useOrdersStore());
const { getOrders, saveOrder, next } = useOrdersStore();
!orders.value.length && (await getOrders());

const { path } = toRefs(useRoute());
const id = computed(() => path.value.split("/").at(-1));
id.value === "orders" && router.push(`/commerce/orders/${orders.value[0].id}`);

const filterText = ref("");
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

const nextPortion = async (ev: Event) => {
    if (!ev) return;
    await next(filterText.value);
};

const unwatchFilterText = watchEffect(async () => {
    await getOrders(filterText.value);
});

onUnmounted(() => {
    unwatchFilterText();
});
</script>
<style scoped lang="sass">
.orders

    &__list
        height: 100%
        border-radius: .5rem
        padding: .5rem

    &__link
        text-decoration: none
        color: inherit

.fade-enter-active, .fade-leave-active
    transition: opacity 0.5s ease

.fade-enter-from, .fade-leave-to
    opacity: 0
</style>
