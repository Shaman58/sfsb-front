<template lang="pug">
    v-btn.control-button(variant="plain" v-bind="$attrs")
        v-tooltip(:text="tooltip")
            template(#activator="{ props }")
                v-icon(v-bind="props" size="30px") {{iconName}}
</template>
<script setup lang="ts">
import {toRefs} from "vue";

const props = defineProps<{ tooltip: string, iconName: string }>()
const {tooltip, iconName} = toRefs(props)
</script>


<style scoped lang="sass">
.control-button
    @media (width < 470px)
        display: block
        padding: 0
        width: 30px
        min-width: 38px
</style>
