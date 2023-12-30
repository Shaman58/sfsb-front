<template>
    <v-dialog v-model="props.visible" width="800" persistent>
        <v-card>
            <v-card-title>
                <span class="text-h5">Заявки</span>
            </v-card-title>
            <v-list density="compact">
                <v-list-item v-for="(item, index) in props.orders" :key="index" :value="item"
                    :title="`№${item.applicationNumber} ${item.customer.companyName}`" @click.stop="active = item.id">

                    <order-create-dialog v-if="active === item.id" :visible="active === item.id" :order="item"
                        :customers="props.customers" @hide="active = -1" @save="save($event)" />

                </v-list-item>
                <v-list-item title="...">
                    <template v-slot:append>
                        <v-btn color="orange-lighten-1" icon="mdi-plus" variant="text" @click.stop="showOrder"></v-btn>
                    </template>

                    <order-create-dialog v-if="order" :visible="active === 'new'" :order="order" :customers="props.customers"
                        @hide="hideOrder" @save="save($event)" />

                </v-list-item>
            </v-list>
            <v-card-actions>
                <v-spacer />
                <v-btn color="orange-darken-1" variant="text" @click="hide">Закрыть
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup>

import { ref, watch } from "vue";
import OrderCreateDialog from "@/components/order/OrderCreateDialog.vue";

const emit = defineEmits();

const props = defineProps({
    orders: {
        type: Array,
        required: true
    },

    customers: {
        type: Array,
        required: true
    },
    visible: {
        type: Boolean,
        required: true
    },
    active: {
        type: [Number, String],
        required: true
    }
});

const order = ref(null);
const active = ref(props.active);

watch(() => props.active, (newValue) => {
    active.value = newValue;
});

const calculateAppNumber = () => {
    const appNumber = props.orders.reduce((max, item) => {
        return item.applicationNumber > max ? item.applicationNumber : max
    }, 0);
    order.value = { applicationNumber: appNumber + 1, items: [], contact: null };
};

const showOrder = () => {
    calculateAppNumber();
    active.value = 'new';
};

const hideOrder = () => {
    order.value = null;
    active.value = -1;
};

const remove = (data) => emit("remove", data);

const hide = () => emit("hide");

const save = (data) => emit("save", data);

</script>
