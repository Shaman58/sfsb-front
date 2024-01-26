<template lang="pug">
    v-form.material-form(ref="form" v-if="materialLocal" )
        v-progress-linear(:active="loading" color="orange" height="4" :indeterminate="true")
        v-card.material-form__card
            v-card-title.material-form__title {{ materialLocal.materialName}}
            v-card-text.material-form__controls
                .material-form__controls-content
                    v-row
                        v-col(cols="4")
                            v-text-field(label="Название:" v-model="materialLocal.materialName" :rules="[rules.required, rules.nameValidation]" counter)
                        v-col(cols="4")
                            v-select(label="Выберите вид:" :items="geometries" item-title="title" item-value="label"
                                v-model="materialLocal.geometry" :rules="[rules.required]" )
                        v-col(cols="4")
                            v-text-field(label="Гост на метериал:"  :rules="[rules.required]" v-model="materialLocal.gost1")
                    v-row
                        v-col(cols="4")
                            v-select(label="Выберите плотность:" :items="templates" item-title="materialTypeName"
                                item-value="density" v-model="materialLocal.density" )
                        v-col(cols="2")
                            v-text-field(label="Плотность:" v-model="materialLocal.density"
                                :rules="[rules.required, rules.numeric]" )
                        v-col(cols="2")
                            v-text-field(label="Стоимость килограмма:" v-model="materialLocal.price.amount"
                                :rules="[rules.required]" type="number")
                        v-col(cols="4")
                            v-text-field(label="Гост на сортамент:" v-model="materialLocal.gost2")

            v-card-actions.material-form__actions
                v-btn.material-form__btn(@click="save") {{ flagNew ? "Сохранить" : "Изменить" }}
                v-spacer
                v-btn.material-form__btn(@click="insert" :disabled="flagNew") Добавить новый

</template>

<script setup lang="ts">
import {onMounted, type Ref, ref, toRefs, toValue, watchEffect} from "vue";
import {useValidationRules} from "@/mixins/FieldValidationRules";
import {useRoute} from "vue-router";
import CONST from "@/consts";
import {storeToRefs} from "pinia";
import {useMaterialTemplatesStore} from "@/pinia-store/materialTemplates";
import {useMaterialsStore} from "@/pinia-store/materials";
import Material from "@/components/data-page/Material.vue";

const {materialTemplates: templates} = storeToRefs(useMaterialTemplatesStore())
const {fetchMaterialTemplates} = useMaterialTemplatesStore()
const {loading} = storeToRefs(useMaterialsStore())
const {saveMaterial} = useMaterialsStore()

const props = defineProps<{ item: Material }>()
const {item} = toRefs(props)
const form = ref<HTMLFormElement>()
const route = useRoute()

const {rules} = useValidationRules();
const geometries = CONST.GEOMETRIES
const materialLocal: Ref<Partial<Material>> = ref(item.value)
const flagNew = ref(false)

// const isDiffPropsLocal: ComputedRef<boolean> = computed(() => {
//     if (!materialLocal || !materialLocal.value || !material.value) return false
//     return (Object.keys(material.value) as Array<keyof typeof material.value>)
//         .every((key: keyof typeof material.value) => material.value[key] === materialLocal.value[key]
//         )
// })

const save = async () => {
    if (!materialLocal.value || !form.value) return
    const valid: { valid: boolean, errors: Ref<string[]> } = await form.value?.validate()
    if (valid.valid) {
        await saveMaterial(materialLocal.value)
        flagNew.value = false
    }
}
const insert = () => {
    materialLocal.value = {
        materialName: "",
        geometry: geometries.at(-1)?.label,
        gost1: "",
        gost2: "",
        density: 0,
        price: {
            amount: 0,
            currency: "RUB"
        }
    }
    flagNew.value = true
}
onMounted(async () => {
    !templates.value.length && await fetchMaterialTemplates()
    materialLocal.value = toValue(item) as Material

})

watchEffect(() => {
    materialLocal.value = item.value
    flagNew.value = false
})


</script>


<style scoped lang="sass">
.material-form
    height: 100%

    &__card
        height: 100%
        display: grid
        grid-template-rows: 50px 1fr 50px

    &__controls
        display: grid
        place-items: center stretch
</style>
