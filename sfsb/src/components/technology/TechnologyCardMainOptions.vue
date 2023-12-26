<template lang="pug">
v-row
    v-col(cols="4")
        v-text-field(v-if="!currentTechnology.assembly" label="Из заготовки" v-model="currentTechnology.quantityOfPartsFromWorkpiece" type="number" :rules="[rules.required, rules.numeric, rules.minValidation]" )
    v-col(cols="4")
        v-text-field(label="Наладочных" v-model="currentTechnology.quantityOfSetUpParts" type="number" :rules="[rules.required, rules.numeric, rules.minValidation]" )
    v-col(cols="4")
        v-text-field(label="На брак" v-model="currentTechnology.quantityOfDefectiveParts" type="number" :rules="[rules.required, rules.numeric, rules.minValidation]" )
    v-col(cols="7")
        v-textarea(clearable label="Описание доп. расходов" v-model="currentTechnology.outsourcedCostsDescription" rows="2" )
    v-col(cols="2")
        v-text-field(label="Сумма" v-model="currentTechnology.outsourcedCosts.amount" type="number" :rules="[rules.required, rules.numeric, rules.min0Validation]" )
    v-col(cols="3")
        DurationPicker(v-model="currentTechnology.technologistTime" label="Продолжительность" :rules="[rules.durationNotZeroValidation]" )

</template>

<script setup lang="ts">
import DurationPicker from "@/components/technology/DurationPicker.vue";
import { useValidationRules } from '@/mixins/FieldValidationRules';
import { useTechnologyStore } from '@/pinia-store/technology';
import { storeToRefs } from 'pinia';

const { currentTechnology, isEqualTechnolgyUserAndCurrentUser } = storeToRefs(useTechnologyStore())
const { rules } = useValidationRules();
</script>

<style lang="sass" scoped>

</style>
