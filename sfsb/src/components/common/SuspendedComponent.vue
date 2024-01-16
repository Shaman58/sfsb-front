<template lang="pug">
    Suspense
        template(#fallback)
            v-progress-circular(indeterminate :size="62" :width="6" color="#2F477E")
        template(#default)
            slot
</template>
<script setup lang="ts">

</script>

