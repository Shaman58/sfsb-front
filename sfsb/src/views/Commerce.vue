<template lang="pug">
    br
    v-container
        .d-flex.justify-center
            suspended-component
                operation-component
        v-row
            v-col(cols="6")
                suspended-component
                    customer-component
            v-col(cols="6")
                suspended-component
                    order-component
</template>

<script setup lang="ts">

import CustomerComponent from "@/components/customer/CustomerComponent.vue";
import OrderComponent from "@/components/order/OrderComponent.vue";
import OperationComponent from "@/components/operation/OperationComponent.vue";
import SuspendedComponent from "@/components/common/SuspendedComponent.vue";

//TODO: возможно перенести в App.vue


</script>
