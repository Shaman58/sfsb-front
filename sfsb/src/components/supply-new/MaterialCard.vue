<template lang="pug">
    v-dialog(v-model="visible" :persistent="true")
        v-card(:title="formatMaterialData(materialLocal)")
            v-form(ref="form" v-model="valid" @submit.prevent="save(materialLocal)" v-if="materialLocal")
                v-card-text
                    v-row
                        v-col(cols="4")
                            v-text-field(label="Название:" v-model="materialLocal.materialName" :rules="[rules.required, rules.nameValidation]" counter :disabled="route.path !== '/date'")
                        v-col(cols="4")
                            v-select(label="Выберите вид:" :items="geometries" item-title="title" item-value="label"
                                v-model="materialLocal.geometry" :rules="[rules.required]" :disabled="route.path !== '/date'")
                        v-col(cols="4")
                            v-text-field(label="Гост на метериал:" v-model="materialLocal.gost1" :disabled="route.path !== '/date'")
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
                    v-card-actions
                        v-spacer
                        v-btn(color="orange-darken-1" variant="text" @click="hide") Закрыть
                        v-btn(color="orange-darken-1" variant="text" type="submit" :disabled="!valid") Сохранить
</template>

<script setup lang="ts">
import {useRoute} from "vue-router"
import {ref, toRefs} from "vue";
import materialDataFormatting from '@/mixins/MaterialDataFormatting'
import {useValidationRules} from "@/mixins/FieldValidationRules";
import CONST from "@/consts"
import {useRolesStore} from "@/pinia-store/roles";
import {useCurrentUserStore} from "@/pinia-store/currentUser";
import {storeToRefs} from "pinia";
import {useMaterialTemplatesStore} from "@/pinia-store/materialTemplates";

const route = useRoute()

const {user} = storeToRefs(useCurrentUserStore())

const props = defineProps<{ material: Material }>();
const {material: materialProp} = toRefs(props)
const emit = defineEmits(["save", "hide"]);

const visible = defineModel("visible")

const {getAllRoles} = useRolesStore()
await getAllRoles()

const {rules} = useValidationRules();
const {formatMaterialData} = materialDataFormatting();
const geometries = CONST.GEOMETRIES

const {materialTemplates: templates} = storeToRefs(useMaterialTemplatesStore())

const form = ref<HTMLFormElement | null>(null);
const valid = ref(false);
const materialLocal = ref(materialProp)
const material = ref({...materialProp.value, price: {...materialProp.value.price}})

const save = (material: Material) => {
    if (form.value && form.value.validate()) {
        emit("save", material);
        emit("hide");
    }
};

const hide = () => {
    // emit("hide");
    vi
    material.value = {...materialProp.value, price: {...materialProp.value.price}};
};

</script>
