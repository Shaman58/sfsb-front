<template lang="pug">
    v-form.material-form(ref="form")
        v-card.material-form__card(:loading="loading")
            v-card-title.material-form__title {{ materialName}}
            v-card-text.material-form__controls
                .material-form__controls-content
                    v-row.material-form__row
                        v-col(cols="4")
                            v-text-field(label="Название:" v-model="materialName" :rules="[rules.required, rules.nameValidation]" counter)
                        v-col(cols="4")
                            v-select(label="Выберите вид:" :items="$geometries" item-title="title" item-value="label"
                                v-model="geometry" :rules="[rules.required]" )
                        v-col(cols="4")
                            v-text-field(label="Гост на метериал:"  :rules="[rules.required]" v-model="gost1")
                    v-row.material-form__row
                        v-col(cols="4")
                            v-select(label="Выберите плотность:" :items="templates" item-title="materialTypeName"
                                item-value="density" v-model="density" )
                        v-col(cols="2")
                            v-text-field(label="Плотность:" v-model="density"
                                :rules="[rules.required, rules.numeric]" )
                        v-col(cols="2")
                            v-text-field(label="Стоимость килограмма:" v-model="price.amount"
                                :rules="[rules.required]" type="number")
                        v-col(cols="4")
                            v-text-field(label="Гост на сортамент:" v-model="gost2")

            v-card-actions.material-form__actions
                v-btn.material-form__btn(@click="save") {{ route.params.id==="new" ? "Сохранить" : "Изменить" }}


</template>

<script setup lang="ts">
import {useRoute} from "vue-router";
import {storeToRefs} from "pinia";
import {useCurrentTool, useToolingStore} from "@/pinia-store/tools";
import {useValidationRules} from "@/mixins/FieldValidationRules";
import {computed, onUnmounted, ref, toRefs, watch} from "vue";
import {useMaterialTemplatesStore} from "@/pinia-store/materialTemplates";
import {de} from "vuetify/locale";

const {rules} = useValidationRules();
const route = useRoute()

const {currentTool: currentType} = storeToRefs(useCurrentTool())
const loading = false


const currentMaterial = computed<Material>(() => (currentType.value?.list.find(e => e.id.toString() === route.params.id.toString()) || currentType.value?.list[0]) as Material)
const {geometry, gost1, gost2, materialName, density, price} = toRefs(currentMaterial.value)
const {materialTemplates: templates} = storeToRefs(useMaterialTemplatesStore())

const save = async ()=>{
    await currentType.value?.save({
        materialName: materialName.value,
        geometry: geometry.value,
        density: density.value,
        gost2: gost2.value,
        gost1: gost1.value,
        price: price.value
    } as Material & Tool)
}

const unwatchRoute = watch([currentMaterial], () => {
    if(!route.path.includes("materials")) return
    if(route.params.id==="new"){
        geometry.value = ""
        gost2.value = ""
        gost1.value = ""
        materialName.value = ""
        density.value = 0
        price.value = {
            amount: 0,
            currency: "RUB",
        }
        return
    }
     geometry.value = currentMaterial.value.geometry
     gost2.value = currentMaterial.value.gost2
     gost1.value = currentMaterial.value.gost1
     materialName.value = currentMaterial.value.materialName
     density.value = currentMaterial.value.density
     price.value = currentMaterial.value.price

}, {immediate: true})
onUnmounted(() => {
    unwatchRoute()
})
</script>


<style scoped lang="sass">
.material-form
    height: 100%

    &__card
        height: 100%
        display: grid
        grid-template-rows: 50px 1fr 50px
        overflow-y: auto

    &__controls
        display: grid
        place-items: center stretch

    &__row

        @media (width < 768px)
            display: grid
            grid-template-columns: 1fr 1fr

            & > *
                width: 100%
                max-width: 100%
                padding: 2px

        @media (width < 530px)
            grid-template-columns: 1fr


</style>
