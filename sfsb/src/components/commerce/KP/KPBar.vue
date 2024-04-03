<template lang="pug">
    .bar
        v-btn(
            v-for="i in menuItems"
            :key="i.emit"
            :title="i.label"
            @click="emit(i.emit)"
            :disabled="disabled && i.canBeDisabled"
        )
            span {{i.label}}
            v-icon(:icon="i.icon" )

</template>

<script setup lang="ts">
import {toRefs} from "vue";
import {menuItems} from "./KPMenuItems"


const emit = defineEmits(["save", "delete", "copy", "download", "print"])
const props = defineProps<{ disabled: boolean }>()
const {disabled} = toRefs(props)
</script>


<style scoped lang="sass">

</style>
