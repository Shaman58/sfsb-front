<template lang="pug">
    v-card.mx-auto(max-width="400")
        v-list(dense="true")
            v-list-subheader Контрагенты:
            v-list-item(v-for="item in customers" :key="item.id" :value="item" color="primary" :title="item.companyName")
            v-list-item
                v-list-item-title ...
</template>

<script setup lang="ts">

const {customers} = defineProps<{ customers: Customer[] }>();

</script>
