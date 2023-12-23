<template>
    <v-dialog v-model="props.visible" persistent>
        <v-card :title=formatMaterialData(material)>
            <v-form ref="form" v-model="valid" @submit.prevent="save(material)">
                <v-card-text>
                    <v-row>
                        <v-col cols="4" v-role:not="['SUPPLIER']">
                            <v-text-field label="Название:" v-model="material.materialName"
                                :rules="[rules.required, rules.nameValidation]" counter>
                            </v-text-field>
                        </v-col>
                        <v-col cols="4" v-role:not="['SUPPLIER']">
                            <v-select label="Выберите вид:" :items="geometries" item-title="title" item-value="label"
                                v-model="material.geometry" :rules="[rules.required]">
                            </v-select>
                        </v-col>
                        <v-col cols="4" v-role:not="['SUPPLIER']">
                            <v-text-field label="Гост на метериал:" v-model="material.gost1">
                            </v-text-field>
                        </v-col>
                        <v-col cols="4" v-role:not="['SUPPLIER']">
                            <v-select label="Выберите плотность:" :items="props.templates" item-title="materialTypeName"
                                item-value="density" v-model="material.density">
                            </v-select>
                        </v-col>
                        <v-col cols="2" v-role:not="['SUPPLIER']">
                            <v-text-field label="Плотность:" v-model="material.density"
                                :rules="[rules.required, rules.numeric]">
                            </v-text-field>
                        </v-col>
                        <v-col cols="2">
                            <v-text-field label="Стоимость килограмма:" v-model="material.price.amount"
                                :rules="[rules.required, rules.numeric]" type="number"></v-text-field>
                        </v-col>
                        <v-col cols="4" v-role:not="['SUPPLIER']">
                            <v-text-field label="Гост на сортамент:" v-model="material.gost2">
                            </v-text-field>
                        </v-col>
                    </v-row>
                    <v-card-actions>
                        <v-spacer />
                        <v-btn color="orange-darken-1" variant="text" @click="hide">
                            Закрыть
                        </v-btn>
                        <v-btn color="orange-darken-1" variant="text" type="submit" :disabled="!valid">
                            Сохранить
                        </v-btn>
                    </v-card-actions>
                </v-card-text>
            </v-form>
        </v-card>
    </v-dialog>
</template>

<script setup lang="ts">
import { useStore } from "vuex";
import { ref } from "vue";
import materialDataFormatting from '@/mixins/MaterialDataFormatting'
import { useValidationRules } from "@/mixins/FieldValidationRules";
import CONST from "@/consts"
import { useRolesStore } from "@/pinia-store/roles";
import useCurrentUser from "@/mixins/CurrentUser";

const { user } = useCurrentUser();

const props = defineProps<{ material: Material, visible: boolean, templates: unknown[] }>();

const emit = defineEmits();

const { getAllRoles } = useRolesStore()
await getAllRoles()

const store = useStore();

const { rules } = useValidationRules();
const { formatMaterialData } = materialDataFormatting();
const geometries = CONST.GEOMETRIES

const form = ref<HTMLFormElement | null>(null);
const valid = ref(false);
const material = ref({ ...props.material, price: { ...props.material.price } })

const save = (material: Material) => {
    if (form.value && form.value.validate()) {
        emit("save", material);
        emit("hide");
    }
};

const hide = () => {
    emit("hide");
    material.value = { ...props.material, price: { ...props.material.price } };
};

</script>
