<template lang="pug">
    v-list.datapage-tabs__list
        v-list-item.datapage-tabs__list-item(
            v-for="(item, index) in props.list"
            :key="item.id"
            @click="selectTool(item)"
            :active="currentTool?.id === item.id"
            :data-last="index === props.list.length-1"
            v-intersect="index === props.list.length-1 && onIntersect"
        )
            DataPageMaterialItem(v-if="isMaterial(item)" :item="item")
            DataPageToolItem(v-if="isTool(item)" :item="item")
</template>
<script setup lang="ts">
import {ref} from "vue";
import DataPageMaterialItem from "@/components/data-page/DataPageMaterialItem.vue";
import DataPageToolItem from "@/components/data-page/DataPageToolItem.vue";

const props = defineProps<{ list: Material[] | Tool[] }>()
const emit = defineEmits(["select"])

const isMaterial = (tool: any): tool is Material => "materialName" in tool
const isTool = (tool: any): tool is Tool => "toolName" in tool

const currentTool = ref<Material | Tool>(props.list[0])

const selectTool = (item: Material | Tool) => {
    currentTool.value = item
    emit('select', item)
}

const onIntersect = () => {
}
</script>


<style scoped lang="sass">

</style>
