<template lang="pug">
    v-dialog(:model-value="visible" @update:model-value="emit('hide')")
        v-card
            v-form(ref="form" v-model="valid" @submit.prevent="save")
                v-card-text
                    v-row
                        v-col(cols="4")
                            v-text-field(label="Название операции:" v-model="operationLocal.operationName" :rules="[rules.required, rules.nameValidation]" counter :disabled="operationLocal.id<3")
                        v-col(cols="4")
                            v-select(label="Описание:" :items="operations" item-title="title" item-value="label" v-model="operation.operationTimeManagement" :disabled="operationLocal.id<3")
                        v-col(cols="4")
                            v-text-field(label="Стоимость за час:" v-model="operationLocal.paymentPerHour.amount" :rules="[rules.required,rules.numeric]" type="number")
                    v-card-actions
                        v-spacer
                        v-btn(color="orange-darken-1" variant="text" @click="hide") Закрыть
                        v-btn(color="orange-darken-1" variant="text" type="submit" :disabled="!valid") Сохранить
                v-container(v-if="!operationLocal.id||operationLocal.id>=3")
                    operation-descriptions
</template>

<script setup lang="ts">
import {useValidationRules} from "@/mixins/FieldValidationRules";
// import useOperationFormatting from "@/mixins/OperationDataFormatting"
import CONST from "@/consts"
import {ref, toRefs} from "vue";
import OperationDescriptions from "@/components/operation/OperationDescriptions.vue";

interface Props {
    operation: Partial<Operation>
    visible: boolean
}

const props = defineProps<Props>();
const {operation, visible} = toRefs(props)

const emit = defineEmits(["hide", "save"]);
const {rules} = useValidationRules();
// const {operations} = useOperationFormatting();
const operations = CONST.OPERATIONS

const form = ref(null);
const valid = ref(false);
const operationLocal = ref(operation);

const save = () => {
    if (form.value.validate()) {
        emit("save", operationLocal);
        emit("hide");
    }
};

const hide = () => {
    emit("hide");
    // operationLocal.value = {} as Operation
}

</script>
