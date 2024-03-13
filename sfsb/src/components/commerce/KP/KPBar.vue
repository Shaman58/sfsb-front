<template lang="pug">
    .bar
            v-btn(v-for="i in menuItems" :key="i.emit" :title="i.label" )
                span {{i.label}}
                v-icon(:icon="i.icon" @click="emit(i.emit)")

</template>

<script setup lang="ts">
const menuItems=[
    {emit: "save", icon: "mdi:mdi-floppy", label: "Сохранить"},
    {emit: "delete", icon: "mdi:mdi-delete", label: "Удалить"},
    {emit: "copy", icon: "mdi:mdi-content-copy", label: "Скопировать"},
    {emit: "download", icon: "mdi:mdi-download", label: "Скачать"},
    {emit: "print", icon: "mdi:mdi-printer", label: "Распечатать"},
]
const emit = defineEmits(["save","delete","copy","download","print"])
</script>


<style scoped lang="sass">

</style>
