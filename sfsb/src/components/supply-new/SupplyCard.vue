<template lang="pug">
    LayoutMain.supply-card
        template(#header)
            .supply-card__header
                v-select(label="Вид" :items="geometries" v-model="selectedType")
                v-text-field(v-model="search" label="Найти материал" clearable)
        .supply-card__main
            v-data-table.supply-card__table(:items="typedCurrentData" :headers  :search
                items-per-page-text="Позиций на листе"
                no-data-text="Данные отсутствуют"
                page-text=""
                :show-current-page="true"
                )

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
import {computed, type ComputedRef, ref, type Ref, toRefs} from "vue"
import SupplyMap, {type SupplyMapInterface} from "./SupplyMap"
import LayoutMain from "@/components/common/LayoutMain.vue";
import CONST from "@/consts";
import {useSupplyStore} from "@/pinia-store/supply";
import {storeToRefs} from "pinia";
import {useRoute} from "vue-router";


// const props = defineProps<{ type: keyof typeof supplyMap }>()
// const {type} = toRefs(props)

const {path} = toRefs(useRoute())

const page = computed(() => path.value.split("/").at(-1))


const search = ref("")

const geometries = CONST.GEOMETRIES
const selectedType: Ref<string | null> = ref(null)

const {materialsAll, materialsNoCost, materialsDateExpired} = storeToRefs(useSupplyStore())
const {saveMaterial, getMaterialsAll, getMaterialsNoCost, getMaterialsDateExpired} = useSupplyStore()

!materialsAll.value.length && await getMaterialsAll()
!materialsNoCost.value.length && await getMaterialsNoCost()
!materialsDateExpired.value.length && await getMaterialsDateExpired()



const supplyMap = SupplyMap(useSupplyStore)
const type: ComputedRef<keyof SupplyMapInterface> = computed(() => {
    const isKeyOfSupplyMap = (x: any): x is keyof SupplyMapInterface =>{
        return x in supplyMap
    }
    if(!page.value) return "all"
    return isKeyOfSupplyMap(page.value) ? page.value : "all"
})

const titleToLabel = (title: string): string | undefined => {
    const found = geometries.find(e => e.title === title)
    if (found) return found.label
}

const currentData = computed(() => supplyMap[type.value].data)
const typedCurrentData = computed(() => currentData.value.filter(e => selectedType.value ? e.geometry === titleToLabel(selectedType.value || "") : true))
const currentItem: Ref<Material | null> = ref(null)
const currentInput = ref<HTMLInputElement>()

const editing = computed(() => !!currentItem)

const previousPrice: Ref<number | undefined> = ref()

const headers = [
    {title: "Название", value: "materialName", key: "materialName"},
    {title: "ГОСТ на материал", value: "gost1"},
    {title: "ГОСТ на сортамент", value: "gost2"},
    {title: "Геометрия", value: "geometry", key: "geometry"},
    {title: "Плотность", value: "density"},
    {title: "Стоимость", value: "price.amount", key: "price.amount"},
    {title: "Сохранить", value: "editing"}
]


const i = ref(0)

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

</script>

<style lang="sass">
.supply-card
    --control-width: 90px
    height: 100%

    &__header
        width: 100%
        display: flex
        align-items: center
        justify-content: space-between
        gap: 0.5rem

    &__main, &__table
        height: 100%

    &__table

        & .v-table__wrapper

            &::-webkit-scrollbar
                width: 4px
                height: 4px
                background-color: transparent

            &::-webkit-scrollbar-thumb
                width: 4px
                height: 4px
                background-color: var(--scroll-color)
                border-radius: 8px

    &__price-span
        width: var(--control-width)

    &__price-input
        width: var(--control-width)
        outline: 1px solid #000

    &__save-item
        translate: 0
        z-index: 2

</style>
