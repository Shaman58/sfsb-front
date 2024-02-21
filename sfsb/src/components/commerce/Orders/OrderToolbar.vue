<template lang="pug">
    v-toolbar.order-card__controls.pa-2
        v-menu
            template(#activator="{ props }")
                v-btn(color="primary" v-bind="props" :disabled="!isOrderComputed || !order.customer?.companyName")
                    ControlButton(tooltip="Коммерческое предложение" icon-name="mdi-offer")
            v-list(@click:select="selectCompany")
                v-list-item(v-for="company in companiesList" :key="company.id" :value="company.companyName")
                    v-list-item-title {{ company.companyName }}
        ControlButton(@click="void previewToolOrder(order, 1, 2)" :disabled="!isAllComputed || !order.id" tooltip="Заявка на инструмент" icon-name="mdi-tools")
        ControlButton(@click="void previewPlan1(order)" :disabled="!isAllComputed || !order.id" tooltip="План1" icon-name="mdi-list-status")
        ControlButton(@click="void previewPlan2(order)" :disabled="!isAllComputed || !order.id"  tooltip="План2" icon-name="mdi-list-status")
        v-spacer
        ControlButton(@click="emit('refresh')"  tooltip="Обновить" icon-name="mdi-refresh")
        ControlButton(@click="save" color="orange-darken-1" variant="text" type="submit" :disabled="!valid" tooltip="Сохранить" icon-name="mdi-floppy")

</template>
<script setup lang="ts">
import ControlButton from "@/components/commerce/Orders/ControlButton.vue"
import {computed, toRefs} from "vue";
import {useOfferGenerator} from "@/mixins/OfferGenerator";
import {useCompaniesStore} from "@/pinia-store/companies";

const props = defineProps<{ order: Order, valid: boolean | null }>()
const {order, valid} = toRefs(props)

const emit = defineEmits(["save", "refresh"])

const {previewCommerce, previewToolOrder, previewPlan1, previewPlan2} = useOfferGenerator();

const isAllComputed = computed(() => order.value.items.every((e: Item) => e.technology.computed))
const isAllWorkpieced = computed(() => order.value.items.every((e: Item) => e.customerMaterial || e.technology.assembly || e.technology.workpiece.material.price.amount))
const isOrderComputed = computed(() => isAllComputed.value && isAllWorkpieced.value)

const {getShortList} = useCompaniesStore()
const companiesList = await getShortList()
const selectCompany = async ({id}: { id: string }) => {
    const selectedCompany = companiesList.find(company => company.companyName === id)
    const selectedId = selectedCompany && selectedCompany.id
    order.value && await previewCommerce(order.value, selectedId)
}

const save = () => {
    emit("save")
}
</script>


<style scoped lang="sass">

</style>
