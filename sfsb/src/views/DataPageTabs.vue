<template lang="pug">
    .datapage-tabs
        router-view

</template>

<script setup lang="ts">

</script>


<style scoped lang="sass">
.fade-enter-active, .fade-leave-active
    transition: opacity .5s

.fade-enter-from, .fade-leave-to
    opacity: 0

.datapage-tabs
    --top: 0px
    margin-top: var(--top)
    height: calc(100dvh - 32px)
    overflow-y: auto
    background-color: rgba(174, 174, 231, 0.3)





</style>
