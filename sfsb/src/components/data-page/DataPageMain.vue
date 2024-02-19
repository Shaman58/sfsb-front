<template lang="pug">
	layout-page
		//template(#title) {{ currentTab?.name }}
		template(#title) {{ $route.meta.name }}
		template(#filter)
			v-text-field.datapage-main__list-filter(label="фильтр" v-model="filterText" clearable)
		template(#list)
			data-page-list(:list="selectedList" @select="setCurrentTool" @intersected="onIntersect")
		template(#card)
			component(:is="selectedComponent" :item="currentTool" @save="save")

</template>
<script setup lang="ts">
import {useRoute} from "vue-router";
import {computed, onUnmounted, ref, watch} from "vue";
import DataPageList from "@/components/data-page/DataPageList.vue";
import MaterialComponent from "@/components/data-page/MaterialComponent.vue";
import ToolComponent from "@/components/data-page/ToolComponent.vue";
import {useCurrentTool, useSwitches} from "@/pinia-store/tools";
import debounce from "@/mixins/Debounce";
import {storeToRefs} from "pinia";
import LayoutPage from "@/components/common/LayoutPage.vue";

const switches = useSwitches()

const {currentTool: currentTab} = storeToRefs(useCurrentTool())


const route = useRoute()
const filterText = ref("")

!currentTab.value?.list.length && await currentTab.value?.fetch()

const currentTool = ref(currentTab.value?.list[0])


const selectedList = computed(() => {
	return currentTab.value?.type === 'Material' ? currentTab.value?.list as Material[] : currentTab.value?.list as Tool[]
})
const selectedComponent = computed(() => currentTab.value?.type === 'Material' ? MaterialComponent : ToolComponent)
const setCurrentTool = (item: Material | Tool) => {
	if (!item) return
	const found = currentTab.value?.list.find(e => e.id === item.id)
	found && (currentTool.value = found)
}
const save = async (ev: Material & Tool) => {
	await currentTab.value?.save(ev)
	const last = document.querySelector(".v-list > .v-list-item[data-last='true']")
	last?.scrollIntoView()
	currentTool.value = selectedList.value.at(-1) || currentTab.value?.list.at(-1)
}

const onIntersect = (e: boolean) => {
	e && currentTab.value?.newData()
}


const backgroundLoadingLists = () => {
	switches.value.forEach(e => {
		if (e.list.length) return
		setTimeout(async () => await e.fetch())
	})
}
backgroundLoadingLists()

const unwatchRoute = watch([route], async () => {
	filterText.value = ""
	!currentTab.value?.list.length && await currentTab.value?.fetch()
})
const unwatchCurrentTab = watch([currentTab], async () => {
	currentTool.value = currentTab.value?.list[0]
	console.log("currentTab", currentTab.value)
})

const unwatchFileterText =watch([filterText], debounce(async () =>
		await currentTab.value?.setFilter(filterText.value)
	, 250))

onUnmounted(()=>{
    unwatchRoute()
    unwatchCurrentTab()
    unwatchFileterText()
})

</script>


<style scoped lang="sass">
</style>
