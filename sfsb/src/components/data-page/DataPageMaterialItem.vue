<template lang="pug">
	.datapage-main__list-name {{ geom.title }} {{ item.materialName }}
	.datapage-main__list-options
		.datapage-main__list-option(v-if="item.gost1") {{ item.gost1}}
		.datapage-main__list-option(v-if="item.gost2") {{ item.gost2}}
</template>

<script setup lang="ts">
import CONSTS from "@/consts"

const props = defineProps<{ item: Material }>()
const geom = CONSTS.GEOMETRIES.find(e => e.label === props.item.geometry)
</script>


<style scoped lang="sass">
.datapage-main
	&__list-name
		font-size: 1.1rem
		font-weight: 700

	&__list-options
		display: flex
		gap: 0.1rem 0.5rem
		flex-wrap: wrap

	&__list-option
		font-weight: 200
		font-size: 0.8rem
		padding: 2px 6px
		background-color: rgb(var(--v-theme-surface-light))
		color: rgb(var(--v-theme-surface-variant))
		border-radius: 8px

</style>
