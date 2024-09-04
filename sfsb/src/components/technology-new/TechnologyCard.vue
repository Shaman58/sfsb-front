<template lang="pug">
    layout-main
        .technology-card
            .technology-card__overall
                technology-table(:items="order.items" @select="$event=>setCurrentItem($event)" :loading="loadingOrders")
            .technology-card__self
                technology-self(@select="$event=>setCurrentItem($event)")
        suspended-component
            technology-create-dialog(@close="refresh")

</template>
<script setup lang="ts">
import { ref, toRefs, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { useOrdersStore } from "@/pinia-store/orders";
import LayoutMain from "@/components/common/LayoutMain.vue";
import TechnologyTable from "@/components/technology-new/TechnologyTable.vue";
import TechnologySelf from "@/components/technology-new/TechnologySelf.vue";
import SuspendedComponent from "@/components/common/SuspendedComponent.vue";
import TechnologyCreateDialog from "@/components/technology/TechnologyCreateDialog.vue";
import { useTechnologyStore } from "@/pinia-store/technology";

const router = useRouter();
const { params, path } = toRefs(useRoute());

const { orders, loading: loadingOrders } = storeToRefs(useOrdersStore());
const { getOrders, getOrderById } = useOrdersStore();
!orders.value.length && (await getOrders());

const hasCurrentOrder = orders.value.find((e) => e.id === +params.value.id);
!hasCurrentOrder && getOrderById(+params.value.id);

// const order = computed(
//     () => orders.value.find((e) => e.id === +params.value.id) || orders.value[0]
// );
const order = ref(orders.value[0]);
console.log(order.value);

const { dialogVisible, currentItem } = storeToRefs(useTechnologyStore());
const { setCurrentItem } = useTechnologyStore();

const refresh = async () => {};

watch(
    [params],
    async () => {
        order.value = await getOrderById(+params.value.id);
    },
    { immediate: true }
);
</script>

<style scoped lang="sass">
.technology-card
    height: 100%
    display: grid
    grid-template-rows: 2fr 1fr
    gap: .5rem

    & > *
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
