<template lang="pug">
    LayoutMain.supply-card
        template(#header)
            .supply-card__header
                v-select(label="Вид" :items="geometries" v-model="selectedType")
                v-text-field(v-model="search" label="Найти материал" clearable)
        .supply-card__main
            v-data-table.supply-card__table(:items="typedCurrentData" :headers  :search
                :items-per-page-text="'Позиций на листе'"
                no-data-text="Данные отсутствуют"
                page-text=""
                :show-current-page="true"
                :items-per-page-options="itemsPerPageOptions"
                v-if="width > breakPoint"
            )

                template(#item="{item}" )
                    tr(@click="doEdit(item)")
                        td
                            strong {{item.materialName}}
                        td {{item.gost1}}
                        td {{item.gost2}}
                        td {{geometryByLabel(item.geometry)}}
                        td {{item.density}}
                        td
                            input.supply-card__price-input(v-if="currentItem && currentItem.id===item.id" type="number"
                                :value="item.price.amount" @input="doChange"  ref="currentInput")
                            .supply-card__price-span(v-else) {{item.price.amount}}
                        td
                            v-icon.me-2.supply-card__save-item(size="small" @click="save") mdi-floppy
            .supply-card__mobile-table(v-if="width < breakPoint")
                v-list.supply-card__mobile-list
                    v-list-item.supply-card__mobile-item(v-for="i in typedCurrentData" :key="'mobile'+i.id" @click="doEdit(i)")
                        .supply-card__mobile-item-content
                            div.supply-card__mobile-param
                                span.supply-card__mobile-key Наименование:
                                span.supply-card__mobile-value {{i.materialName}}
                            div.supply-card__mobile-param
                                span.supply-card__mobile-key ГОСТ на материал:
                                span.supply-card__mobile-value {{i.gost1}}
                            div.supply-card__mobile-param
                                span.supply-card__mobile-key ГОСТ на сортимент:
                                span.supply-card__mobile-value {{i.gost2}}
                            div.supply-card__mobile-param
                                span.supply-card__mobile-key Плотность:
                                span.supply-card__mobile-value {{i.density}}
                            div.supply-card__mobile-param.supply-card__mobile-price
                                strong Цена:&nbsp;
                                input.supply-card__price-input.supply-card__price-input-mobile(v-if="currentItem && currentItem.id===i.id" type="number"
                                    :value="i.price.amount"  @input="doChange" ref="currentInputMobile")
                                span.supply-card__price-span(v-else) {{i.price.amount}}
                                v-icon.me-2.supply-card__save-item(size="small" @click="save" :data-disabled="!currentItem || currentItem.id!==i.id" ) mdi-floppy
</template>

<script setup lang="ts">
import {computed, type ComputedRef, ref, type Ref, toRefs, watchEffect} from "vue"
import SupplyMap, {type SupplyMapInterface} from "./SupplyMap"
import LayoutMain from "@/components/common/LayoutMain.vue";
import CONST from "@/consts";
import {useSupplyStore} from "@/pinia-store/supply";
import {storeToRefs} from "pinia";
import {useRoute} from "vue-router";
import {useDisplay} from "vuetify";


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

const {width} = useDisplay()

const supplyMap = SupplyMap(useSupplyStore)
const type: ComputedRef<keyof SupplyMapInterface> = computed(() => {
    const isKeyOfSupplyMap = (x: any): x is keyof SupplyMapInterface => {
        return x in supplyMap
    }
    if (!page.value) return "all"
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
const currentInputMobile = ref<HTMLInputElement[]>([])
const currentValue = ref(0)
const breakPoint = 768


const editing = computed(() => !!currentItem)


const headers = [
    {title: "Название", value: "materialName", key: "materialName"},
    {title: "ГОСТ на материал", value: "gost1"},
    {title: "ГОСТ на сортамент", value: "gost2"},
    {title: "Геометрия", value: "geometry", key: "geometry"},
    {title: "Плотность", value: "density"},
    {title: "Стоимость", value: "price.amount", key: "price.amount"},
    {title: "Сохранить", value: "editing"}
]

const itemsPerPageOptions = [
    {value: 10, title: '10'},
    {value: 20, title: '20'},
    {value: 50, title: '50'},
    {value: 100, title: '100'},
    {value: -1, title: 'Все'}
]


const i = ref(0)

const doEdit = (item: Material) => {
    currentValue.value = 0
    currentItem.value = item
    setTimeout(() => {
        const input = currentInput.value ? currentInput.value : currentInputMobile.value["0"]
        if (!input) return
        input.type = "text"
        input.focus()
        input.setSelectionRange(input.value.length, input.value.length)
        input.type = "number"

    })
}

const doChange = (event: Event) => {
    const val = (event.target as HTMLInputElement).value
    console.log("doChange", (event.target as HTMLInputElement).value)
    currentValue.value= +val ? +val : 0
}

const save = async () => {
    // const input = currentInput.value ? currentInput.value : currentInputMobile.value["0"]
    currentItem.value && currentValue.value && (currentItem.value.price.amount = currentValue.value)
    currentItem.value && await saveMaterial(currentItem.value)
}

const geometryByLabel = (material: string) => {
    const geometry = CONST.GEOMETRIES.find(e => e.label === material)
    return geometry && geometry.title
}


</script>

<style lang="sass">
.supply-card
    --control-width: 6em
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
        font-size: clamp(11px, 16 / 1024 * 100vw, 16px)

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
        border-bottom: 1px solid transparent

    &__price-input
        width: var(--control-width)
        outline: 1px solid rgb(var(--v-theme-primary))
        border-bottom: 1px solid transparent

        &.supply-card__price-input-mobile
            outline: none
            border-bottom: 1px solid #7775

    &__save-item
        translate: 0
        z-index: 2

        &[data-disabled="true"]
            opacity: 0.5
            pointer-events: none

    &__mobile-item-content
        padding: .3em

    &__mobile-price
        padding: .3em
        border-bottom: 1px solid #7777
        border-top: 1px solid #7777
        display: flex
        align-items: center
        height: 3em

    &__mobile-param
        display: flex
        gap: 0.5em

    &__mobile-key
        opacity: 0.6

</style>
