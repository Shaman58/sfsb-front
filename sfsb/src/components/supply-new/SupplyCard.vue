<template lang="pug">
    LayoutMain.supply-card
        template(#header)
            .supply-card__header
                v-autocomplete(label="Вид" :items="geometries" v-model="selectedType" )
                v-text-field(v-model="filterText" label="Найти материал")
        .supply-card__main
            h3 {{supplyMap[type].title}}
            v-data-table(:items="currentData" :headers)
                //template(#item.actions="{ item }")
                //    v-icon( size="small"  @click="console.log(item)") mdi-pencil
                template(#item="{item}" )
                    tr(@click="currentItem=item")
                        td
                            strong {{item.materialName}}
                        td {{item.gost1}}
                        td {{item.gost2}}
                        td {{geometryByLabel(item.geometry)}}
                        td {{item.density}}
                        td
                            input.supply-card__price-input(v-if="currentItem && currentItem.id===item.id" type="number"
                                :value="item.price.amount"  ref="currentInput")
                            .supply-card__price-span(v-else) {{item.price.amount}}
                        td
                            v-icon.me-2.supply-card__save-item(size="small" @click="save") mdi-floppy
</template>

<script setup lang="ts">
import {computed, type Ref, ref, toRefs} from "vue"
import SupplyMap from "./SupplyMap"
import LayoutMain from "@/components/common/LayoutMain.vue";
import CONST from "@/consts";
import {useSupplyStore} from "@/pinia-store/supply";
import {storeToRefs} from "pinia";

const a = ref(false)


const props = defineProps<{ type: keyof typeof supplyMap }>()
const {type} = toRefs(props)


const filterText = ref("")
const geometries = CONST.GEOMETRIES
const selectedType: Ref<string | null> = ref(null)

const {materialsAll, materialsNoCost, materialsDateExpired} = storeToRefs(useSupplyStore())
const {saveMaterial, getMaterialsAll, getMaterialsNoCost, getMaterialsDateExpired} = useSupplyStore()

!materialsAll.value.length && await getMaterialsAll()
!materialsNoCost.value.length && await getMaterialsNoCost()
!materialsDateExpired.value.length && await getMaterialsDateExpired()

const supplyMap = SupplyMap(useSupplyStore)

const currentData = computed(() => supplyMap[type.value].data)
const currentItem: Ref<Material | null> = ref(null)
const currentInput = ref<HTMLInputElement>()

const editing = computed(() => !!currentItem)

const previousPrice: Ref<number | undefined> = ref()

const headers = [
    {title: "Название", value: "materialName"},
    {title: "ГОСТ на материал", value: "gost1"},
    {title: "ГОСТ на сортамент", value: "gost2"},
    {title: "Геометрия", value: "geometry"},
    {title: "Плотность", value: "density"},
    {title: "Стоимость", value: "amount"},
    {title: "Редакировать", value: "editing"}
]

const doEdit = (item: Material) => {
    currentItem.value = item
    previousPrice.value = currentItem.value.price.amount
    setTimeout(() => {
        currentInput.value && currentInput.value.focus()
    })
}

const save = async () => {
    currentItem.value && currentInput.value && (currentItem.value.price.amount = +currentInput.value.value)
    currentItem.value && await saveMaterial(currentItem.value)
}

const geometryByLabel = (material: string) => {
    const geometry = CONST.GEOMETRIES.find(e => e.label === material)
    return geometry && geometry.title
}


// const supplyStore = storeToRefs(useSupplyStore())
//
// await getData()
//
// const materialList = supplyStore[materials as keyof typeof supplyStore]
//
// const filteredList: ComputedRef<Material[]> = computed(() => materialList.value.filter(e =>
//     `${e.materialName} ${e.gost1} ${e.gost2}`
//         .toLowerCase()
//         .includes(filterText.value.toLowerCase()))
//     .filter(e => {
//         const label = geometries.find(v => v.title === selectedType.value)?.label || null
//         return selectedType.value ? e.geometry === label : true
//     }))
//
// const geometryByLabel = (material: string) => {
//     const geometry = CONST.GEOMETRIES.find(e => e.label === material)
//     return geometry && geometry.title
// }

</script>

<style lang="sass" scoped>
.supply-card
    --control-width: 90px

    &__header
        width: 100%
        display: flex
        align-items: center
        justify-content: space-between
        gap: 0.5rem

    &__price-span
        width: var(--control-width)

    &__price-input
        width: var(--control-width)
        outline: 1px solid #000

    &__save-item
        translate: 0
        z-index: 2

</style>
