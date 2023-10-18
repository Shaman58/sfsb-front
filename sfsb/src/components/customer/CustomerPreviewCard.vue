<template>
  <v-card class="mx-auto" max-width="400">
    <v-list dense>
      <v-list-subheader>Контрагенты:</v-list-subheader>
      <v-list-item
        v-for="item in props.customers"
        :key="item.id"
        :value="item"
        color="primary"
        :title="item.companyName">
      </v-list-item>
      <v-list-item>
        <v-list-item-title>...</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-card>
</template>

<script setup>

const props = defineProps({
  customers: {
    type: Array,
    required: true
  }
});

</script>
