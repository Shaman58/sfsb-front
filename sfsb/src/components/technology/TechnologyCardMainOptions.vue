<template lang="pug">
    v-row
        v-col(cols="12"  xs="12" sm="6" md="4")
            v-text-field(v-if="!currentTechnology.assembly" label="Из заготовки" v-model="currentTechnology.quantityOfPartsFromWorkpiece" type="number" :rules="[rules.required, rules.numeric, rules.minValidation]" )
        v-col(cols="12"  xs="12" sm="6" md="4")
            v-text-field(label="Наладочных" v-model="currentTechnology.quantityOfSetUpParts" type="number" :rules="[rules.required, rules.numeric, rules.minValidation]" )
        v-col(cols="12"  xs="12" sm="6" md="4")
            v-text-field(label="На брак" v-model="currentTechnology.quantityOfDefectiveParts" type="number" :rules="[rules.required, rules.numeric, rules.minValidation]" )
        v-col(cols="12"  xs="12" sm="6" md="7")
            v-textarea(clearable label="Описание доп. расходов" v-model="currentTechnology.outsourcedCostsDescription" rows="2" )
        v-col(cols="12"  xs="12" sm="3" md="2")
            v-text-field(label="Сумма"  v-model="currentTechnology.outsourcedCosts.amount" type="number" :rules="[rules.required, rules.numeric, rules.min0Validation]" )
        v-col(cols="12"  xs="12" sm="3" md="3")
            DurationPicker(v-model="currentTechnology.technologistTime" label="Время технолога" :rules="[rules.durationNotZeroValidation]" )

</template>

<script setup lang="ts">
import DurationPicker from "@/components/technology/DurationPicker.vue";
import {useValidationRules} from '@/mixins/FieldValidationRules';
import {useTechnologyStore} from '@/pinia-store/technology';
import {storeToRefs} from 'pinia';

const {currentItem} = storeToRefs(useTechnologyStore())
const {rules} = useValidationRules();

const currentTechnology = currentItem.value.technology
</script>

<style lang="sass" scoped>

</style>
