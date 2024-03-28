<template lang="pug">
    v-data-table(:items :headers :search)
        template(#item="{item}" )
            KPItem(:item @append="append" @remove="remove")
</template>
<script setup lang="ts">
import {Empty} from "@/mixins/Empty";
import {storeToRefs} from "pinia";
import useTechnologies from "@/pinia-store/technologies";
import {ref, watch} from "vue";
import KPItem from "@/components/commerce/KP/KPItem.vue";

const items = defineModel<KPItem[]>("items")
const props = defineProps<{ search: string }>()
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
    newItem.created = new Date(Date.now()).toDateString()
    items.value = [...items.value.toSpliced(index + 1, 0, newItem)]
}

const remove = (item: KPItem) => {
    if (!items.value) return
    const index = items.value.indexOf(item)
    console.log(index);
    items.value = items.value.toSpliced(index, 1)
}

const select = ref("")
watch([select], console.log)
</script>


<style scoped lang="sass">

</style>
