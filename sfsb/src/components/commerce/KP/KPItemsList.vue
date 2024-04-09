<template lang="pug">
    v-data-table.kp-items-list(:items :headers :search :data-disabled="props.disabled" )
        template(#item="{item}" )
            KPItem(:item @append="append" @remove="remove")
</template>
<script setup lang="ts">
import {Empty} from "@/mixins/Empty";
import {storeToRefs} from "pinia";
import useTechnologies from "@/pinia-store/technologies";
import {computed, ref, watch} from "vue";
import KPItem from "@/components/commerce/KP/KPItem.vue";
import {useThemeStore} from "@/pinia-store/themeSwitcher";

const items = defineModel<KPItem[]>("items")
const props = defineProps<{ search: string, disabled: boolean }>()
const headers = [
    {key: "controls", title: "Управление"},
    {key: "decimal", title: "Децимальный номер"},
    {key: "name", title: "Наименование"},
    {key: "price", title: "Прайс"},
    {key: "amount", title: "Количество"},
    {key: "total", title: "Итого"}
]

const {technologies} = storeToRefs(useTechnologies())
const {fetch} = useTechnologies()
!technologies.value.length && await fetch()

const append = (item: KPItem) => {
    if (!items.value) return
    const index = items.value.indexOf(item)
    console.log(index);
    const newItem = Empty.KPItem()
    newItem.created = new Date(Date.now()).toLocaleDateString() + " " + new Date(Date.now()).toLocaleTimeString().replace(/:\d\d$/, "")
    items.value = [...items.value.toSpliced(index + 1, 0, newItem)]
}

const remove = (item: KPItem) => {
    if (!items.value) return
    const index = items.value.indexOf(item)
    console.log(index);
    items.value = items.value.toSpliced(index, 1)
}

const select = ref("")

const {theme} = storeToRefs(useThemeStore())
const themeCss = computed(() => theme.value ? 'brightness(25%)' : 'brightness(150%)')
watch([select], console.log)
</script>


<style scoped lang="sass">
.kp-items-list
    &.v-table[data-disabled="true"]
        filter: v-bind("themeCss")
        pointer-events: none
        user-select: none

</style>
