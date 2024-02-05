<template lang="pug">
    v-btn(variant="plain" v-bind="$attrs")
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

</style>
