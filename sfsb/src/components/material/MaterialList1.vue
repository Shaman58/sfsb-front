<template>
    <v-dialog :modelValue="visible">
        <v-card>
            <v-card-title>
                <v-row>
                    <v-col cols="4">
                        <v-select label="Выберите вид:" :items="geometries" item-text="title" v-model="geometry"
                            item-value="label" clearable>
                        </v-select>
                    </v-col>
                    <v-col cols="4">
                        <v-text-field label="Фильтр:" v-model="filter">
                        </v-text-field>
                    </v-col>
                </v-row>
            </v-card-title>
            <v-list>
                <v-list-item v-for="(item, index) in filtered" :key="index" :title="formatMaterialData(item)"
                    @click.stop="active = index">

                    <template v-slot:append>
                        <v-btn color="orange-lighten-1" icon="mdi-delete" variant="text" @click.stop="remove(item)"></v-btn>
                    </template>

                    <material-create :material="item" :templates="materialTemplates" :visible="active === index"
                        @hide="active = -1" @save="save($event)" />

                </v-list-item>

                <v-list-item :title="'...'">

                    <template v-slot:append>
                        <v-btn color="orange-lighten-1" icon="mdi-plus" variant="text" @click.stop="active = 'new'" />
                    </template>

                    <material-create :material="{ price: { currency: 'RUB', amount: 0 } }" :templates="materialTemplates"
                        :visible="active === 'new'" @hide="active = -1" @save="save($event)" />

                </v-list-item>
            </v-list>

            <v-card-actions>
                <v-spacer />
                <v-btn color="orange-darken-1" variant="text" @click="emit('update:visible', false)">
                    Закрыть
                </v-btn>
            </v-card-actions>

        </v-card>
    </v-dialog>
</template>

<script setup  lang="ts">
import { ComputedRef, Ref, computed, ref } from "vue";
import { useStore } from "vuex";
import materialDataFormatting from '@/mixins/MaterialDataFormatting'
import MaterialCreate from "@/components/material/MaterialCreate.vue";
import CONSTS from "@/consts"

const { visible } = defineProps<{ visible: boolean }>()
console.log("visible", visible);
const emit = defineEmits(["update:visible"])



const store = useStore();
// const emit = defineEmits();
store.dispatch("fetchMaterials")
store.dispatch("fetchMaterialTemplates")

const materials = computed(() => store.getters.getMaterials)
const materialTemplates = computed(() => store.getters.getMaterialTemplates)
const { formatMaterialData } = materialDataFormatting();
const geometries = CONSTS.GEOMETRIES

console.log("🚀 ~ file: MaterialList1.vue:99 ~ materials:", materials)
console.log("🚀 ~ file: MaterialList1.vue:101 ~ materialTemplates:", materialTemplates)

const geometry = ref(null);
const active: Ref<number | string | null> = ref(null);
const filter: Ref<string | null> = ref(null);

const filtered: ComputedRef<Material[]> = computed(() => {
    return materials.value.filter((item: Material) => {
        return (
            (!geometry.value || item.geometry === geometry.value) &&
            (!filter.value || item.materialName.toLowerCase().includes(filter.value.toLowerCase()) || item.gost1.toLowerCase().includes(filter.value.toLowerCase()) || item.gost2.toLowerCase().includes(filter.value.toLowerCase()))
        );
    });
});

const remove = (item: Material) => {
    store.dispatch('deleteMaterial', item);
}
const save = (item: Material) => {
    store.dispatch('saveMaterial', item);
}


</script>
