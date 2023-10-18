<template>
  <v-card class="mx-auto" max-width="344" variant="outlined">
    <v-card-item>
      <div class="text-overline mb-1">
        {{ props.company.email }}
        <br>
        {{ props.company.phoneNumber }}
      </div>
      <div class="text-h6 mb-1">
        {{ props.company.companyName }}
      </div>
      <div class="text-caption">{{ props.company.address }}</div>
    </v-card-item>
  </v-card>
</template>

<script setup>

const props = defineProps({
  company: {
    type: Object,
    required: true
  }
});

</script>
