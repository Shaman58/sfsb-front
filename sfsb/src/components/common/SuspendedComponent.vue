<template lang="pug">
    Suspense.suspended-component
        template(#fallback)
            div.suspended-component__loader-container
                v-progress-circular(indeterminate :size="62" :width="6" color="#2F477E")
        template(#default)
            slot
</template>
<script setup lang="ts">

</script>

<style lang="sass" scoped>
.suspended-component

    &__loader-container
        height: min(100%, 100dvh)
        width: 100%
        display: grid
        place-items: center

</style>

