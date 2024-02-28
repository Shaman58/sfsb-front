<template lang="pug">
    layout-page
        template(#title) {{ $route.meta.name }}
        template(#filter)
            v-text-field.datapage-main__list-filter(label="фильтр" v-model="filterText" clearable)
        template(#list)
            data-page-list1(:list="selectedList")
                template(#default="{item}")
                    data-page-material-item(v-if="$route.meta.name==='Материалы'" :item="item")
                    data-page-tool-item(v-else :item="item")
        template(#card)
            router-view
</template>
<script setup lang="ts">
import {useRoute, useRouter} from "vue-router";
import {computed, onUnmounted, ref, watch} from "vue";
import {useCurrentTool, useSwitches} from "@/pinia-store/tools";
import debounce from "@/mixins/Debounce";
import {storeToRefs} from "pinia";
import LayoutPage from "@/components/common/LayoutPage.vue";
import SuspendedComponent from "@/components/common/SuspendedComponent.vue";
import DataPageList1 from "@/components/data-page/DataPageList1.vue";
import DataPageToolItem from "@/components/data-page/DataPageToolItem.vue";
import DataPageMaterialItem from "@/components/data-page/DataPageMaterialItem.vue";

const switches = useSwitches()

const {currentTool: currentTab} = storeToRefs(useCurrentTool())


const route = useRoute()
const filterText = ref("")

!currentTab.value?.list.length && await currentTab.value?.fetch()

const selectedList = computed(() => {
    return currentTab.value?.type === 'Material' ? currentTab.value?.list as Material[] : currentTab.value?.list as Tool[]
})

const router = useRouter()

const backgroundLoadingLists = () => {
    switches.value.forEach(e => {
        if (e.list.length) return
        setTimeout(async () => await e.fetch())
    })
}
backgroundLoadingLists()

const unwatchRoute = watch([route], async () => {
    if (!currentTab.value) return
    filterText.value = ""
    !currentTab.value.list.length && await currentTab.value.fetch()
    const splitPath = route.path.split("/")
    if (splitPath.at(-1) === "new") return
    if (Number.isNaN(Number(splitPath.at(-1)))) await router.push(route.path + "/" + currentTab.value.list[0].id)
}, {immediate: true})
// const unwatchCurrentTab = watch([currentTab], async () => {
// 	currentTool.value = currentTab.value?.list[0]
// 	console.log("currentTab", currentTab.value)
// })
//
const unwatchFilterText = watch([filterText], debounce(async () =>
        await currentTab.value?.setFilter(filterText.value)
    , 250))

onUnmounted(() => {
    unwatchRoute()
    // unwatchCurrentTab()
    unwatchFilterText()
})

</script>


<style scoped lang="sass">
</style>
