<template lang="pug">
  LayoutPage
    template(#title) Операции
    template(#filter)
      v-text-field(label="фильтр" v-model="filterText" clearable)
    template(#list)
      suspended-component
        OperationsList(:filter="filterText")
    template(#card)
      suspended-component
        router-view

</template>
<script setup lang="ts">
import {ref} from "vue";
import LayoutPage from "@/components/common/LayoutPage.vue";
import SuspendedComponent from "@/components/common/SuspendedComponent.vue";
import OperationsList from "@/components/commerce/Operations/OperationsList.vue";

const filterText = ref("")

</script>
<style lang="sass">
.list-link
  display: block
  color: inherit
  text-decoration: none
</style>
