<template lang="pug">
    LayoutMain.supply-card
        template(#header)
            .supply-card__header
                v-autocomplete(label="Вид" :items="geometries" v-model="selectedType" )
                v-text-field(v-model="filterText" label="Найти материал")
        .supply-card__main
            h3 {{supplyMap[type].title}}
            v-data-table(:items="currentData")
                //template(#item.actions="{ item }")
                //    v-icon( size="small"  @click="console.log(item)") mdi-pencil
                template(#item="{item}")
                    tr(@click="console.log(item)")
                        td {{item.materialName}}
            //v-table(density="compact")
                //thead
                //    th Наимменование
                //    th ГОСТ1
                //    th ГОСТ2
                //    th Геометрия
                //    th Цена
                //
                //tbody
                //    tr(v-for="item in currentData" :key="item.id")
                //        td {{item.materialName}}
                //        td {{item.gost1}}
                //        td {{item.gost2}}
                //        td {{item.geometry}}
                //        td
                //            v-text-field(v-model="item.price.amount"  variant="underlined")
    //    v-list.supply-card__list
    //        v-list-item.supply-card__item(v-for="material in filteredList" @click="$emit('select',material)" :key="material.id")
    //            span {{geometryByLabel(material.geometry)}} {{ material.materialName }} {{ material.gost1 || "" }} {{ material.gost2 || "" }}
    //            .supply-card__dates
    //                span обновлен: {{ material.updated }}
</template>

<script setup lang="ts">
import {computed, type Ref, ref, toRefs, watchEffect} from "vue"
import SupplyMap from "./SupplyMap"
import LayoutMain from "@/components/common/LayoutMain.vue";
import CONST from "@/consts";
import {useSupplyStore} from "@/pinia-store/supply";
import {storeToRefs} from "pinia";

interface Props {
    title: string
    materials: string
    getData: () => Promise<void>
}

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

watchEffect(() => console.log("currentData", currentData.value))

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

    &__header
        width: 100%
        display: flex
        align-items: center
        justify-content: space-between
        gap: 0.5rem
</style>
