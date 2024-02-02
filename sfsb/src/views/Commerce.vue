<template lang="pug">
    //br
    //v-container
    //    .d-flex.justify-center
    //        suspended-component
    //            operation-component
    //    v-row
    //        v-col(cols="6")
    //            suspended-component
    //                customer-component
    //        v-col(cols="6")
    //            suspended-component
    //                order-component
    suspended-component
        router-view
</template>

<script setup lang="ts">

//TODO: возможно перенести в App.vue


import SuspendedComponent from "@/components/common/SuspendedComponent.vue";
</script>
