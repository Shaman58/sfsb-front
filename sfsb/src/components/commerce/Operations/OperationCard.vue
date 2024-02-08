<template lang="pug">
    LayoutMain.operation-card
        v-card(:style="{height:'100%'}")
            v-form#operation-form(ref="form" v-model="valid" @submit.prevent="save")
                v-card-text(v-if="operationLocal")
                    v-text-field( label="Название операции:" v-model="operationLocal.operationName" :rules="[rules.required, rules.nameValidation]" counter :disabled="operationLocal.id<3")
                    v-select(label="Описание:" :items="CONST.OPERATIONS" item-title="title" item-value="label" v-model="operationLocal.operationTimeManagement" :disabled="operationLocal.id<3" )
                    v-text-field( label="Стоимость за час:" v-model="operationLocal.paymentPerHour.amount" :rules="[rules.required,rules.numeric]" type="number")
                    v-container(v-if="!operationLocal?.id||operationLocal?.id>=3")
                        OperationDescriptions
        template(#footer)
            v-card.operation-card__footer
                v-btn(color="orange-darken-1" variant="text" type="submit" :disabled="!valid" form="operation-form") Сохранить
</template>
<script setup lang="ts">

import {useRoute} from "vue-router";
import {storeToRefs} from "pinia";
import {useOperationsStore} from "@/pinia-store/operations";
import {ref, type Ref, toRefs, watch} from "vue";
import {useValidationRules} from "@/mixins/FieldValidationRules";
import emptyOperation from "@/components/commerce/Operations/EmptyOperation";
import CONST from "@/consts";
import OperationDescriptions from "@/components/commerce/Operations/OperationDescriptions.vue";
import LayoutMain from "@/components/common/LayoutMain.vue";

const {params} = toRefs(useRoute())

const {operations, loading} = storeToRefs(useOperationsStore())
const {saveOperation, fetchOperation} = useOperationsStore()
!operations.value.length && await fetchOperation()

const operationLocal: Ref<Operation> = ref(params.value.id === "new"
    ? emptyOperation() satisfies Operation
    : operations.value.find(e => e.id === +params.value.id) || operations.value[0]
)

const form = ref<HTMLFormElement>()
const valid = ref(false);
const {rules} = useValidationRules();

const save = async () => {
    await saveOperation(operationLocal.value)
}

watch(params, () => {
    operationLocal.value = params.value.id === "new"
        ? emptyOperation() satisfies Operation
        : operations.value.find(e => e.id === +params.value.id) || operations.value[0]

}, {immediate: true})

</script>
<style scoped lang="sass">
.operation-card

    &__footer
        width: 100%
        height: 100%
        display: grid
        place-items: center start
</style>
