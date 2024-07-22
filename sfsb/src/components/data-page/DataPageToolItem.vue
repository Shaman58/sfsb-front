<template lang="pug">
    .datapage-tabs__list-name {{ props.item.toolName }}
        .datapage-tabs__list-options
            .datapage-tabs__list-option(v-if="props.item.description") {{ props.item.description}}
</template>

<script setup lang="ts">
const props = defineProps<{ item: Tool }>()
</script>


<style scoped lang="sass">

</style>
