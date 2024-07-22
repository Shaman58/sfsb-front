<template>
    <v-text-field v-model="internalDuration" :label="label" outlined @input="handleInput" :rules="computedRules"
                  type="text"
                  persistent-hint placeholder="00:00" maxlength="5"/>
</template>

<script setup lang="ts">
import {computed, ComputedRef, ref, watch} from 'vue';

interface Props {
    modelValue: string
    label: string
    rules: ((value: string) => boolean | string)[]
}

const emit = defineEmits();

const props = defineProps<Props>();

const internalDuration = ref(props.modelValue || '00:00');

const handleInput = () => {

    if (internalDuration.value.length > 2 && internalDuration.value[2] !== ':') {
        internalDuration.value = internalDuration.value.slice(0, 2) + ':' + internalDuration.value.slice(2);
    }

    if (internalDuration.value.length === 2) {
        internalDuration.value = internalDuration.value + ':';
    }

    const pattern = /^([0-9]{2}):([0-9]{2})$/;
    const match = internalDuration.value.match(pattern);

    if (match) {
        const hours = match[1];
        let minutes = match[2];

        if (parseInt(minutes[0]) > 5) {
            minutes = '5' + minutes[1];
        }

        const updatedTime = hours + ':' + minutes;
        if (validateDuration(updatedTime)) {
            emit("update:modelValue", updatedTime);
        }
    }
}

const computedRules: ComputedRef<((value: string) => boolean | string)[]> = computed(() => {
    return [...props.rules, (value: string) => {
        const pattern = /^([0-9]{2}):([0-5][0-9])$/;
        return pattern.test(value) || 'Неверный формат ЧЧ:ММ'
    }];
});

const validateDuration = (value: string) => {
    return computedRules.value.every((rule => rule(value) === true));
};

watch(() => props.modelValue, (newValue) => {
    internalDuration.value = newValue;
});

</script>
