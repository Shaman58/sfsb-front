<template lang="pug">
    LayoutMain
        template(#header)
            div(style="height: 8px; width: 100%;")
                v-progress-linear(v-show="loading" indeterminate :color="$defaultColor")
            OrderToolbar(
                :order="orderLocal"
                :valid="valid && areAllQuantitieNotNull"
                :is-same-user="isSameUser || user.roles.includes('ADMIN')"
                :is-new="isNew"
                @save="save"
                @refresh="refresh"
                @save-k-p="saveKP"
                @deleteOrder="deleteOrderHandler"
            )
        .order-card
            v-form.order-card__form(ref="form" v-model="valid")
                v-expansion-panels.order-card__container(:multiple="true" v-model="panel" )

                    v-expansion-panel.order-card__common(value="common" @click="onCommonPanel")
                        v-expansion-panel-title ОБЩИЕ ДАННЫЕ
                        v-expansion-panel-text(:enabled="canOpenCommonPanel")
                            div(style="margin-bottom: 1rem;" v-if="orderLocal && orderLocal.user")
                                span Автор:&nbsp;
                                strong {{ orderLocal.user.lastName }}&nbsp;
                                strong {{ orderLocal.user.firstName }}
                                v-spacer
                                span Дата создания: {{ new Date(orderLocal.created).toLocaleDateString()}} {{new Date(orderLocal.created).toLocaleTimeString() }}
                            v-row(v-if="orderLocal")
                                v-col(cols="3")
                                    v-text-field(label="Номер заявки:" v-model="orderLocal.applicationNumber" :rules="[rules.required]" maxlength="5")
                                v-col(cols="9")
                                    v-select(v-if="customers" :items="customers" :item-title="'companyName'" return-object v-model="orderLocal.customer" :rules="[rules.required]" @update:modelValue="orderLocal && (orderLocal.contact = null)" label="Заказчик")

                    v-expansion-panel.order-card__group-items(value="items")
                        v-expansion-panel-title ПОЗИЦИИ ЗАКАЗА
                        v-expansion-panel-text.order-card__group-text
                            OrderItems(:items="orderLocal.items" :customer="orderLocal.customer?.companyName" :number="+orderLocal?.applicationNumber")

                    v-expansion-panel.order-card__files(value="files")
                        v-expansion-panel-title ФАЙЛЫ
                        v-expansion-panel-text
                            suspended-component
                                OrderFiles(:order-id="orderLocal.id")

                    v-expansion-panel.order-card__descriptions(value="descriptions")
                        v-expansion-panel-title ДОПОЛНИТЕЛЬНЫЕ ДАННЫЕ
                        v-expansion-panel-text
                            v-textarea(v-model="orderLocal.description" label="Описание" )
                            v-textarea(v-model="orderLocal.businessProposal" label="Бизнес предложение" )
        AlertDialog(ref="alertDialog")
        Alert2DeleteDialog(ref="alertDialogDelete" title="Вы уверены, что хотите удалить данный заказ?" )

</template>
<script setup lang="ts">
import {
    computed,
    onMounted,
    onUnmounted,
    type Ref,
    ref,
    toRefs,
    watch,
    watchEffect,
} from "vue";
import SuspendedComponent from "@/components/common/SuspendedComponent.vue";
import OrderFiles from "@/components/commerce/Orders/OrderFiles.vue";
import { useValidationRules } from "@/mixins/FieldValidationRules";
import { storeToRefs } from "pinia";
import { useCustomersStore } from "@/pinia-store/customers";
import LayoutMain from "@/components/common/LayoutMain.vue";
import OrderToolbar from "@/components/commerce/Orders/OrderToolbar.vue";
import OrderItems from "@/components/commerce/Orders/OrderItems.vue";
import { onBeforeRouteUpdate, useRoute, useRouter } from "vue-router";
import { useOrdersStore } from "@/pinia-store/orders";
import AlertDialog from "@/components/common/AlertDialog.vue";
import { useCurrentUserStore } from "@/pinia-store/currentUser";
import { Empty } from "@/mixins/Empty";
import { useToast } from "vue-toast-notification";
import Alert2DeleteDialog from "@/components/common/Alert2DeleteDialog.vue";

const toast = useToast();

const router = useRouter();
const { params } = toRefs(useRoute());

const isNew = computed(() => params.value.id === "new");

const { orders, loading } = storeToRefs(useOrdersStore());
const {
    saveOrder,
    getOrders,
    getOrderById,
    saveKP: storeKP,
    deleteOrder,
} = useOrdersStore();

// const hasCurrentOrder = orders.value.find((e) => e.id + "" === params.value.id);
// if (!hasCurrentOrder && params.value.id !== "new") router.push("/not-found");

// const order = computed(() =>
//     params.value.id === "new"
//         ? Empty.Order()
//         : orders.value.find((e) => e.id + "" === params.value.id) ||
//           orders.value[0]
// );

const orderLocal = ref<Order>(Empty.Order() as Order);

const alertDialog = ref();
const alertDialogDelete = ref();

const form = ref<HTMLFormElement>();
const valid = ref(false);
const panel = ref<string[]>(["common", "items"]);

const { rules } = useValidationRules();

const { customers } = storeToRefs(useCustomersStore());
const { fetchCustomers } = useCustomersStore();
!customers.value.length && (await fetchCustomers());

const { user } = storeToRefs(useCurrentUserStore());

const isSameUser = computed(() => {
    return orderLocal.value.user && orderLocal.value.user.id === user.value?.id;
});
const isAdmin = computed(() => {
    return user.value?.roles.includes("ADMIN");
});
const canOpenCommonPanel = computed(
    () => isNew.value || isSameUser.value || isAdmin.value
);

const areAllQuantitieNotNull = computed(() => {
    return orderLocal.value.items.every((e) => e.quantity > 0);
});

const refresh = async () => {
    await getOrders();
};

const save = async () => {
    if (orderLocal.value.user && !isSameUser.value && alertDialog.value) {
        try {
            alertDialog.value.show();
            const res = await alertDialog.value.getAnswer();
            console.log("res", res);
        } catch (error) {
            return toast.error("Ошибка при удалении данного заказа");
        } finally {
            alertDialog.value.hide();
        }
    }
    const valid: { valid: boolean; errors: Ref<string[]> } | null =
        form.value && (await form.value.validate());
    if (!valid?.valid) return;
    const res = await saveOrder(orderLocal.value);
    console.log("res", res);

    setTimeout(async () => {
        res && res.id && (await router.push(`/commerce/orders/${res.id}`));
    }, 500);
};

const saveKP = ({
    orderId,
    companyId,
}: {
    orderId: number;
    companyId: number;
}) => {
    console.log("saveKP", orderId, companyId);
    const ERROR_MESSAGE =
        "Для сохранения коммерческого предложения выберите компанию-поставщика";
    if (!companyId) return toast.error(ERROR_MESSAGE);
    storeKP(orderId, companyId);
};

const deleteOrderHandler = async () => {
    const deletingOrderId = orderLocal.value.id;
    try {
        alertDialogDelete.value.show();
        const res = await alertDialogDelete.value.getAnswer();
        await deleteOrder(orderLocal.value.id);
    } catch (error) {
        return;
    } finally {
        alertDialogDelete.value.hide();
    }
};

const onCommonPanel = () => {
    if (!canOpenCommonPanel.value)
        toast.error(
            "Изменить наименование клиента и номер заказа может только владелец"
        );
};

const unwatch = watch([params], () => {
    panel.value = params.value.id === "new" ? ["common", "items"] : panel.value;
});

const unwatchApplicationNumber = watchEffect(() => {
    console.log("ApplicationNumber", orderLocal.value.applicationNumber);
    orderLocal.value.applicationNumber = Number(
        String(orderLocal.value.applicationNumber).replace(/\D+/g, "")
    );
});

const init = async () => {
    if (params.value.id === "new") {
        orderLocal.value = Empty.Order() as Order;
        return;
    }
    const res = await getOrderById(+params.value.id);
    if (!res) await router.push("/not-found");
    orderLocal.value = res;
};
const unwatchParams = watchEffect(init);
onMounted(init);

onBeforeRouteUpdate((v) => {
    console.log("onBeforeRouteUpdate", v);
});

onUnmounted(() => {
    unwatch();
    unwatchParams();
    unwatchApplicationNumber();
});
</script>
<style lang="sass">
.order-card
    display: grid
    gap: 0.5rem
    height: 100%


    &__form
        height: 100%
        overflow-y: auto

        &::-webkit-scrollbar
            width: 4px
            background-color: transparent

        &::-webkit-scrollbar-thumb
            width: 4px
            background-color: var(--scroll-color)
            border-radius: 8px

    &__details-content
        display: flex
        align-items: center
        gap: 0.5rem

        & > *
            flex: 1 1

    &__controls
        display: flex
        align-items: center

    &__items
        display: grid
        grid-template-columns: repeat(2, 1fr)
        gap: 0.5rem
        height: min(500px, 100%)

    &__items-list
        height: 100%
        overflow-y: auto

        &::-webkit-scrollbar
            width: 4px
            background-color: transparent

        &::-webkit-scrollbar-thumb
            width: 4px
            background-color: var(--scroll-color)
            border-radius: 8px

    &__group-text > .v-expansion-panel-text__wrapper

        @media (width < 1024px)
            padding-inline: 0

    .common-panel
        opacity: 0.3
        pointer-events: none

        &[enabled=true]
            opacity: 1
            pointer-events: auto
</style>
