<template lang="pug">
    v-form.material-form(ref="form")
        v-card.material-form__card(:loading="currentTool.loading")
            v-card-title.material-form__title {{ local.materialName}}
            v-card-text.material-form__controls
                .material-form__controls-content
                    v-row.material-form__row
                        v-col(cols="12" sm="6" md="4")
                            v-text-field(label="Название:" v-model="local.materialName" :rules="[rules.required, rules.nameValidation]" counter)
                        v-col(cols="12" sm="6" md="4")
                            v-select(label="Выберите вид:" :items="$geometries" item-title="title" item-value="label"
                                v-model="local.geometry" :rules="[rules.required]" )
                        v-col(cols="12" sm="12" md="4")
                            v-text-field(label="Гост на метериал:"  :rules="[rules.required]" v-model="local.gost1")
                    v-row.material-form__row
                        v-col(cols="12"   sm="6" md="4")
                            v-select(label="Выберите плотность:" :items="templates" item-title="materialTypeName"
                                item-value="local.density" v-model="local.density" )
                        v-col(cols="12"   sm="6" md="2")
                            v-text-field(label="Плотность:" v-model="local.density"
                                :rules="[rules.required, rules.numeric]" )
                        v-col(cols="12"   sm="6" md="2")
                            v-text-field(label="Стоимость килограмма:" v-model="local.price.amount"
                                :rules="[rules.required]" type="number")
                        v-col(cols="12"   sm="6" md="4")
                            v-text-field(label="Гост на сортамент:" v-model="local.gost2")

            v-card-actions.material-form__actions
                v-btn.material-form__btn(@click="save") {{ route.params.id==="new" ? "Сохранить" : "Изменить" }}
</template>
<script setup lang="ts">
import {useRoute} from "vue-router";
import {storeToRefs} from "pinia";
import {useCurrentTool} from "@/pinia-store/tools";
import {reactive, ref, toRefs, watch, watchEffect} from "vue";
import {useValidationRules} from "@/mixins/FieldValidationRules";
import {useMaterialTemplatesStore} from "@/pinia-store/materialTemplates";
import emptyMaterial from "@/components/data-page/EmptyMaterial";

const route = useRoute()


const {currentTool} = storeToRefs(useCurrentTool())
const selectedTool = ref((currentTool.value!.list.find(e => +e.id === +route.params.id) || currentTool.value!.list[0]) as Material)

const {rules} = useValidationRules();

const local = ref(emptyMaterial())

const {gost1, gost2, density, geometry, materialName, price: {value: {amount}}} = toRefs(selectedTool.value)


const {materialTemplates: templates} = storeToRefs(useMaterialTemplatesStore())
const {fetchMaterialTemplates} = useMaterialTemplatesStore()
!templates.value.length && await fetchMaterialTemplates()

const save = async () => {
    const res = {...selectedTool.value, ...local.value} as Material & Tool
    currentTool.value && await currentTool.value.save(res)
}

watch([local],() => console.log("local", local.value),{deep: true})

watch([route], () => {
        if (route.params.id === "new") {
            selectedTool.value = emptyMaterial() as Material
        } else {
            selectedTool.value = (currentTool.value!.list.find(e => +e.id === +route.params.id) || currentTool.value!.list[0]) as Material
        }


        for (const key in local.value) {
            if (local.value.hasOwnProperty(key)) {
                local.value[key] = selectedTool.value[key as keyof Partial<Material>]
            }
        }
        local.value.price && (local.value.price = {
            ...local.value.price,
            amount: selectedTool.value.price.amount
        })
    }, {immediate: true}
)

</script>


<style scoped lang="sass">

</style>
