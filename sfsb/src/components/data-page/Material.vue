<template lang="pug">
    v-form.material-form(ref="form" v-if="materialLocal" )
        v-card.material-form__card
            v-card-title.material-form__title {{ materialLocal.materialName}}
            v-card-text.material-form__controls
                .material-form__controls-content
                    v-row
                        v-col(cols="4")
                            v-text-field(label="Название:" v-model="materialLocal.materialName" :rules="[rules.required, rules.nameValidation]" counter :disabled="route.path !== '/date'")
                        v-col(cols="4")
                            v-select(label="Выберите вид:" :items="geometries" item-title="title" item-value="label"
                                v-model="materialLocal.geometry" :rules="[rules.required]" :disabled="route.path !== '/date'")
                        v-col(cols="4")
                            v-text-field(label="Гост на метериал:" v-model="materialLocal.gost1" :disabled="route.path !== '/date'")
                    v-row
                        v-col(cols="4")
                            v-select(label="Выберите плотность:" :items="templates" item-title="materialTypeName"
                                item-value="density" v-model="materialLocal.density" :disabled="route.path !== '/date'")
                        v-col(cols="2")
                            v-text-field(label="Плотность:" v-model="materialLocal.density"
                                :rules="[rules.required, rules.numeric]" :disabled="route.path !== '/date'")
                        v-col(cols="2")
                            v-text-field(label="Стоимость килограмма:" v-model="materialLocal.price.amount"
                                :rules="[rules.required, rules.numeric]" type="number"
                                :disabled="route.path !== '/date' && route.path !== '/supplier'")
                        v-col(cols="4")
                            v-text-field(label="Гост на сортамент:" v-model="materialLocal.gost2"
                                :disabled="route.path !== '/date'")

            v-card-actions.material-form__actions
                v-btn.material-form__btn(@click="save") Изменить
                v-spacer
                v-btn.material-form__btn(@click="insert") Добавить новый

</template>

<script setup lang="ts">
import {onMounted, onUpdated, type Ref, ref, toRefs, toValue, watchEffect} from "vue";
import {useValidationRules} from "@/mixins/FieldValidationRules";
import {useRoute} from "vue-router";
import CONST from "@/consts";
import {storeToRefs} from "pinia";
import {useMaterialTemplatesStore} from "@/pinia-store/materialTemplates";
import {useMaterialsStore} from "@/pinia-store/materials";
import Material from "@/components/data-page/Material.vue";

const {materialTemplates: templates} = storeToRefs(useMaterialTemplatesStore())
const {fetchMaterialTemplates} = useMaterialTemplatesStore()
const {saveMaterial} = useMaterialsStore()

const props = defineProps<{ material: Material }>()
const {material} = toRefs(props)
const form = ref<HTMLFormElement>()
const route = useRoute()

const {rules} = useValidationRules();
const geometries = CONST.GEOMETRIES
const materialLocal: Ref<Partial<Material>> = ref(material.value)

// const isDiffPropsLocal: ComputedRef<boolean> = computed(() => {
//     if (!materialLocal || !materialLocal.value || !material.value) return false
//     return (Object.keys(material.value) as Array<keyof typeof material.value>)
//         .every((key: keyof typeof material.value) => material.value[key] === materialLocal.value[key]
//         )
// })

const save = async () => {
    if (!materialLocal.value) return
    await saveMaterial(material.value)
}
const insert = () => {
    materialLocal.value = {
        materialName: "",
        geometry: geometries.at(-1)?.label,
        gost1: "",
        gost2: "",
        density: 0,
        price: {
            amount: 0
        }
    }
}
onMounted(async () => {
    !templates.value.length && await fetchMaterialTemplates()
    materialLocal.value = toValue(material) as Material

})

watchEffect(() => {
    materialLocal.value = material.value
})

onUpdated(() => {
    console.log("Material was updated")
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
