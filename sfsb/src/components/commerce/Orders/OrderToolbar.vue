<template lang="pug">
    v-toolbar.order-card__controls.pa-2
        v-menu
            template(#activator="{ props }")
                v-btn(
                    color="primary"
                    v-bind="props"
                    :disabled="!isOrderComputed || !order.customer?.companyName"
                )
                    ControlButton(tooltip="Коммерческое предложение" icon-name="mdi-offer")
            v-list(@click:select="selectCompany($event)")
                v-list-item(v-for="company in companiesList" :key="company.id" :value="company.companyName")
                    v-list-item-title {{ company.companyName }}

        v-menu
            template(#activator="{ props }")
                v-btn(
                    color="primary"
                    v-bind="props"
                    :disabled="!isOrderComputed || !order.customer?.companyName"
                )
                    ControlButton(tooltip="Заявка на инструмент" icon-name="mdi-tools")
            v-list(@click:select="printToolOrder($event)")
                v-list-item(v-for="company in companiesList" :key="company.id" :value="company.companyName")
                    v-list-item-title {{ company.companyName }}

        ControlButton(@click="void previewPlan1(order)" :disabled="!isAllComputed || !order.id" tooltip="План1" icon-name="mdi-list-status")
        ControlButton(@click="void previewPlan2(order)" :disabled="!isAllComputed || !order.id"  tooltip="План2" icon-name="mdi-list-status")
        v-menu
            template(#activator="{ props }")
                v-btn(color="primary" v-bind="props" :disabled="!isOrderComputed || !order.customer?.companyName")
                    ControlButton(tooltip="Сохранить коммерческое предложение" icon-name="mdi-book")
            v-list(@click:select="selectCompanyForKP($event)")
                v-list-item(v-for="company in companiesList" :key="company.id" :value="company.companyName")
                    v-list-item-title {{ company.companyName }}
        v-spacer
        ControlButton(@click="emit('refresh')"  tooltip="Обновить" icon-name="mdi-refresh")
        ControlButton(@click="save" color="orange-darken-1" variant="text" type="submit" :disabled="!valid" tooltip="Сохранить" icon-name="mdi-floppy")
        ControlButton(
            @click="deleteOrder"
            color="orange-darken-1"
            variant="text"
            :disabled="!isSameUser || isNew "
            tooltip="Удалить"
            icon-name="mdi-close"
        )

</template>
<script setup lang="ts">
import ControlButton from "@/components/commerce/Orders/ControlButton.vue";
import { computed, ref, toRefs } from "vue";
import { useOfferGenerator } from "@/mixins/OfferGenerator";
import { useCompaniesStore } from "@/pinia-store/companies";
import router from "@/router";

const props = defineProps<{
    order: Order;
    valid: boolean | null;
    isSameUser: boolean;
    isNew: boolean;
}>();
const { order, valid, isSameUser, isNew } = toRefs(props);

const emit = defineEmits(["save", "refresh", "saveKP", "deleteOrder"]);

const { previewCommerce, previewToolOrder, previewPlan1, previewPlan2 } =
    useOfferGenerator();

const isAllComputed = computed(() =>
    order.value.items.every((e: Item) => e.technology.computed)
);
const isAllWorkpieced = computed(() =>
    order.value.items.every(
        (e: Item) =>
            e.customerMaterial ||
            e.technology.assembly ||
            e.technology.workpiece.material.price.amount
    )
);
const isOrderComputed = computed(
    () => isAllComputed.value && isAllWorkpieced.value
);

const { getShortList } = useCompaniesStore();
const companiesList = await getShortList();

const selectedCompanyId = ref<number | undefined>();

const getCompanyId = (name: string) => {
    const selectedCompany = companiesList.find(
        (company) => company.companyName === name
    );
    return selectedCompany && selectedCompany.id;
};

const generateSelectCompany =
    (url: string) =>
    async ({ id }: { id: string }) => {
        const selectedId = getCompanyId(id);
        selectedCompanyId.value = selectedId;
        // order.value && await previewCommerce(order.value, selectedId)
        await router.push(`${url}/${order.value.id}/${selectedId}`);
    };
const selectCompany = generateSelectCompany("/commerce/print-order");

const printToolOrder = generateSelectCompany("/commerce/print-tool");

const selectCompanyForKP = ({ id }: { id: string }) => {
    const selectedId = getCompanyId(id);
    emit("saveKP", { orderId: order.value.id, companyId: selectedId });
};

const save = () => {
    emit("save");
};

const deleteOrder = () => {
    emit("deleteOrder");
};
</script>

<style scoped lang="sass"></style>
