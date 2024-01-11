<template>
    <br>
    <v-container>
        <div class="d-flex justify-center">
            <operation-component/>
        </div>
        <v-row>
            <v-col cols="6">
                <customer-component/>
            </v-col>
            <v-col cols="6">
                <order-component/>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup lang="ts">

import CustomerComponent from "@/components/customer/CustomerComponent.vue";
import OrderComponent from "@/components/order/OrderComponent.vue";
import {onMounted} from "vue";
import {useStore} from "vuex";
import OperationComponent from "@/components/operation/OperationComponent.vue";

const store = useStore();

//TODO: возможно перенести в App.vue

onMounted(() => {
    store.dispatch("fetchCustomers");
    store.dispatch("fetchOrders");
});


</script>
