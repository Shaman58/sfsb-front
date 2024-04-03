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

const menuItems = [
    {emit: "save", icon: "mdi:mdi-floppy", label: "Сохранить", canBeDisabled: false},
    {emit: "delete", icon: "mdi:mdi-delete", label: "Удалить", canBeDisabled: true},
    {emit: "copy", icon: "mdi:mdi-content-copy", label: "Скопировать", canBeDisabled: true},
    {emit: "refresh", icon: "mdi:mdi-refresh", label: "Обновить", canBeDisabled: true},
    {emit: "download", icon: "mdi:mdi-download", label: "Сохранить", canBeDisabled: true},
    {emit: "print", icon: "mdi:mdi-printer", label: "Печать", canBeDisabled: true},
] as const
const emit = defineEmits(["save", "delete", "copy", "download", "print"])
const props = defineProps<{ disabled: boolean }>()
const {disabled} = toRefs(props)
</script>


<style scoped lang="sass">

</style>
