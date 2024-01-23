<template lang="pug">
    v-dialog(v-model="visible" :persistent="true")
        v-card
            v-form(ref="form" v-model="valid" @submit.prevent="save(toolItem)")
                v-card-title
                    span.text-h5 Приспособление
                v-card-text
                    v-container(v-if="additionals.length!==0")
                        v-list
                            v-list-item( v-for="(tool, index) in additionals" :key="index" :title="tool.toolName + ' ' + formatWorkpieceData(tool.workpiece)" :subtitle="tool.amount + 'шт.'")
                                template(#append)
                                    v-btn( color="orange-lighten-1" icon="mdi-delete" variant="text" @click.stop="remove(index)")

                    v-container
                        v-row
                            v-col(cols="4" v-if="!workpieceCardVisible")
                                v-card( width="200" title="Заготовка:" @click="showWorkpieceCard")
                                    v-card-item {{ !!(toolItem.workpiece) ? formatWorkpieceData(toolItem.workpiece) : "Задать заготовку"}}
                            v-col(v-else)
                                tech-workpiece-card( :workpiece="{...toolItem.workpiece}" :materials="materials" @validatedWorkpiece="saveWorkpiece" @hide="hideWorkpieceCard" )
                            v-col(cols="5" v-if="!workpieceCardVisible")
                                v-text-field( label="Название приспособы" v-model="toolItem.toolName" :rules="[rules.required, rules.nameValidation]" )
                            v-col(cols="3" v-if="!workpieceCardVisible")
                                v-text-field( label="Количество" v-model="toolItem.amount" :rules="[rules.required, rules.minValidation]")
                            v-col(cols="3" v-if="!workpieceCardVisible")
                                v-text-field( label="Время изготовления(чч:мм)" v-model="toolItem.processTime" type="time" @focus="toolItem.processTime='00:00'" :rules="[rules.required, rules.durationNotZeroValidation]")

                v-card-actions
                    v-spacer
                    v-btn(color="orange-darken-1" variant="text" @click="hide") Закрыть
                    v-btn(color="orange-darken-1" variant="text" type="submit" :disabled="!valid || !toolItem.workpiece") Добавить
</template>

<script setup lang="ts">
import {computed, ref, toRefs} from "vue";
import {useValidationRules} from "@/mixins/FieldValidationRules";
import TechWorkpieceCard from "@/components/technology/TechWorkpieceCard.vue";
import materialDataFormatting from "@/mixins/MaterialDataFormatting";

interface Props {
    visible: boolean
    additionals: AdditionalTool[]
}

const props = defineProps<Props>();

const {rules} = useValidationRules();
const emit = defineEmits(["hide"])
const form = ref(null);
const valid = ref(false);
const toolItem = ref({} as AdditionalTool);
const {formatWorkpieceData} = materialDataFormatting();
const workpieceCardVisible = ref(false);
const {additionals, visible} = toRefs(props);
const materials = computed(() => store.getters.getMaterials);

const showWorkpieceCard = () => {
    workpieceCardVisible.value = true;
};

const hideWorkpieceCard = () => {
    workpieceCardVisible.value = false;
};

const saveWorkpiece = (validWorkpiece) => {
    toolItem.value.workpiece = validWorkpiece;
};

const hide = () => {
    emit('hide');
};

const save = (savedTool) => {
    additionals.push({...savedTool});
    toolItem.value = {workpiece: undefined, toolName: ''};
};

const remove = (index) => {
    additionals.splice(index, 1);
};

</script>
