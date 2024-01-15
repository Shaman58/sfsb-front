<template lang="pug">
    v-dialog(v-model="props.visible" width="800")
        v-form(ref="form" v-model="valid" @submit.prevent="save(order)" style="height: 800px; overflow-y: auto;")
            v-card
                v-card-text
                    h2 Заявка
                    div(style="margin-top: 1rem;" v-if="props.order && props.order.user") Автор:
                        strong {{ props.order.user.lastName }}&nbsp;
                        strong {{ props.order.user.firstName }}
                v-card-text
                    v-container
                        v-row
                            v-col(cols="3")
                                v-text-field(label="Номер заявки:" v-model="order.applicationNumber" :rules="[rules.required]" maxlength="5")
                            v-col(cols="9")
                                v-select(v-if="customers" :items="customers" :item-title="'companyName'" return-object v-model="order.customer" :rules="[rules.required]" @update:modelValue="order.contact = null" label="Заказчик")

                            v-row(v-if="order.id")
                                order-items(v-model:items="order.items")

                            v-col(cols="12")
                                v-textarea(label="Название" v-model="order.description" :rules="[rules.required]")
                            v-col(cols="12")
                                v-textarea(label="КП" v-model="order.businessProposal" :rules="[rules.required]")
                            v-divider

                            order-files(:order="props.order.id" v-if="props.order.id")

            v-card-actions.card-actions
                //v-btn(@click="previewCommerce(order)" :disabled="!isOrderComputed") компред
                v-select(@update:modelValue="selectCompany" label="компред" :items="companies" :disabled="!isOrderComputed" variant="underlined" )
                v-btn(@click="previewToolOrder(order, 1, 2)" :disabled="!isAllComputed") заявка на инструмент
                v-btn(@click="previewPlan1(order)" :disabled="!isAllComputed") План 1
                v-btn(@click="previewPlan2(order)" :disabled="!isAllComputed") План 2
                v-spacer
                v-btn(color="orange-darken-1" variant="text" @click="hide") Закрыть
                v-btn(color="orange-darken-1" variant="text" type="submit" :disabled="!valid") {{ order.id ? 'Изменить' : 'Создать' }}

    AlertDialog(ref="alertDialog")
</template>

<script setup lang="ts">
import type {Ref} from "vue"
import {computed, onMounted, reactive, ref, watch} from "vue";
import {useValidationRules} from "@/mixins/FieldValidationRules";
import {useOfferGenerator} from "@/mixins/OfferGenerator";
import OrderFiles from "./OrderFiles.vue";
// import keycloakService from "@/plugins/keycloak/service.mjs";
import AlertDialog from "@/components/common/AlertDialog.vue";
import {storeToRefs} from "pinia";
import {useCurrentUserStore} from "@/pinia-store/currentUser";
import OrderItems from "@/components/order/OrderItems.vue";
import {useCompaniesStore} from "@/pinia-store/companies";

interface Props {
    order: Order
    customers: Customer[],
    visible: boolean
}

const props = defineProps<Props>();
const emit = defineEmits(["save", "hide"]);

const {user} = storeToRefs(useCurrentUserStore())

const alertDialog = ref<typeof AlertDialog | null>(null)

const {getShortList} = useCompaniesStore()
const companiesList = await getShortList()
const companies = companiesList.map(company => company.companyName)
// const store = useStore();
const {rules} = useValidationRules();
const {previewCommerce, previewToolOrder, previewPlan1, previewPlan2} = useOfferGenerator();

const form = ref(null);
const valid = ref(false);
const active: Ref<number | string> = ref(-1);

const selectCompany = async (e: string) => {
    const selectedCompany = companiesList.find(company => company.companyName === e)
    const selectedId = selectedCompany && selectedCompany.id
    await previewCommerce(order, selectedId)
}

const emptyItem = {technology: {outsourcedCosts: {amount: 0, currency: 'RUB'}}, customerMaterial: false} as Item


// const order = ref(JSON.parse(JSON.stringify(props.order)));
let order = reactive(props.order);

watch([order], console.log)
const complexId = (item: Item) => item.id + "" + item.uid

const hide = () => {
    // order.value = JSON.parse(JSON.stringify(props.order));
    order = reactive(props.order)
    emit("hide");
};

const isSameUser = () => {
    return props.order.user && props.order.user.id === user.value?.id;
}

const isAllComputed = computed(() => order.items.every((e: Item) => e.technology.computed))
const isAllWorkpieced = computed(() => order.items.every((e: Item) => e.customerMaterial || e.technology.assembly || e.technology.workpiece.material.price.amount))
const isOrderComputed = computed(() => isAllComputed.value && isAllWorkpieced.value)

const save = async (data: Order) => {
    if (props.order.user && !isSameUser() && alertDialog.value) {
        try {
            alertDialog.value.show()
            const res = await alertDialog.value.getAnswer()
            console.log("res", res);
        } catch (error) {
            return
        } finally {
            alertDialog.value.hide()
        }
    }
    emit("save", data);
    // saveFiles()
    if (!data.id) {
        emit("hide");
    }

};

const addItem = (data: Partial<Item>) => {
    lastIndex++
    data.uid = lastIndex
    order.items.push({...data} as Item);
};

const replaceItem = async (item: Item) => {
    // order.value.items.splice(index, 1, item);
    order.items = order.items.map((e: Item) => e.id === item.id ? item : e)
};

const deleteItem = async (id: number | string) => {
    order.items = order.items.filter((e: Item) => complexId(e) !== id);
};

const setActive = (data: number) => {
    active.value = data;
};

const kpAvailable = computed(() => {
    if (order.items.length === 0) {
        return true;
    }
    const index = order.items.findIndex((item: Item) => item.technology.computed === false);
    return index !== -1;
});

const getBackgroundColorClass = (item: Item) => {
    if (item.technology?.computed && item.technology.workpiece?.material?.price?.amount) {
        return 'computed';
    } else {
        return 'not-computed';
    }
};

let lastIndex = 0;

onMounted(() => {
    lastIndex = order.items.reduce((acc, e) => e.id > acc ? e.id : acc, 0)
})

const change = (changedOrder: Order) => {
    // order = reactive(changedOrder)
}
</script>

<style lang="sass">
.not-computed
    border: 1px solid #ff7b7b
    border-radius: 10px
    margin: 2px


.computed
    border: 1px solid #97ffa0
    border-radius: 10px
    margin: 2px


.card-actions
    background: #fff
    border-radius: 0 0 4px 4px


</style>
