<template lang="pug">
    v-dialog(:model-value="visible")
        v-card
            v-card-title
                v-row
                    v-col(cols="6")
                        v-select(label="Выберите вид:" :items="geometries" item-text="title" v-model="geometry" item-value="label" :clearable="true")
                    v-col(cols="6")
                        v-text-field(label="Фильтр:" v-model="filter")
            v-list
                v-list-item(v-for="item in filtered" :key="item.id" :title="formatMaterialData(item)" @click.stop="setActiveMaterial(item)")
                    //material-create( :material="item" :templates="materialTemplates" :visible="active === index" @hide="active = -1" @save="save($event)")

                v-list-item(:title="'...'")
                    template(#append)
                        v-btn(color="orange-lighten-1" icon="mdi-plus" variant="text" @click.stop="active = 'new'")

                    //material-create(:material="{ price: { currency: 'RUB', amount: 0 } }" :templates="materialTemplates" :visible="active === 'new'" @hide="active = -1" @save="save($event)")

            v-card-actions
                v-spacer
                v-btn(color="orange-darken-1" variant="text" @click="emit('update:visible', false)") Закрыть

    material-create( :material="activeMaterial" :templates="materialTemplates" v-model:visible="showMaterialCreate" @hide="showMaterialCreate=false" @save="save($event)")
</template>

<script setup lang="ts">
import {computed, type ComputedRef, type Ref, ref} from "vue";
import materialDataFormatting from '@/mixins/MaterialDataFormatting'
import MaterialCreate from "@/components/material/MaterialCreate.vue";
import CONSTS from "@/consts"
import {storeToRefs} from "pinia";
import {useMaterialsStore} from "@/pinia-store/tools";
import {useMaterialTemplatesStore} from "@/pinia-store/materialTemplates";

const props = defineProps<{ visible: boolean }>()
const emit = defineEmits(["update:visible"])

const {tools: materials} = storeToRefs(useMaterialsStore())
const {fetchTool: fetchMaterials, saveTool: saveMaterial, deleteTool: deleteMaterial} = useMaterialsStore()

const {materialTemplates} = storeToRefs(useMaterialTemplatesStore())
const {fetchMaterialTemplates} = useMaterialTemplatesStore()

const showMaterialCreate = ref(false)
const activeMaterial: Ref<Material | null> = ref(null)

const setActiveMaterial = (material: Material) => {
    activeMaterial.value = material
    showMaterialCreate.value = true
}


const {formatMaterialData} = materialDataFormatting();
const geometries = CONSTS.GEOMETRIES


const geometry = ref(null);
const active: Ref<number | string | null> = ref(null);
const filter: Ref<string | null> = ref(null);

const filtered: ComputedRef<Material[]> = computed(() => {
    return materials.value.filter((item: Material) => {
        return (
            (!geometry.value || item.geometry === geometry.value) &&
            (!filter.value || item.materialName.toLowerCase().includes(filter.value.toLowerCase()) || item.gost1.toLowerCase().includes(filter.value.toLowerCase()) || item.gost2?.toLowerCase().includes(filter.value.toLowerCase()))
        );
    });
});

const remove = async (item: Material) => {
    await deleteMaterial(item);
}
const save = async (item: Material) => {
    await saveMaterial(item);
}


</script>
