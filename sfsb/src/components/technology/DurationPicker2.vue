<template>
    <v-text-field
        v-model="modelValue"
        ref="inputElement"
        :label="props.label"
        outlined
        type="text"
        persistent-hint
        placeholder="00:00"
    />
</template>
<script setup lang="ts">
import { onMounted, ref, watch } from "vue";

const modelValue = defineModel<string>();
const props = defineProps<{ label: string }>();

const setCaretPosition = (position) => {
    setTimeout(() => {
        if ("setSelectionRange" in inputElement.value) {
            inputElement.value.setSelectionRange(position, position);
        }
    });
};

onMounted(() => {
    // Пример: установка каретки в начало при монтировании компонента
    setCaretPosition(0);
});

const inputElement = ref<HTMLInputElement | null>(null);

const formatInput = (value: string) => {
    value = value.replace(/\D/g, "");
    let firstPart = value.slice(0, 2).padEnd(2, "0");
    let secondPart = value.slice(2, 4).padEnd(2, "0");

    if (secondPart.length === 2 && parseInt(secondPart) > 59) {
        secondPart = "59";
    }

    return `${firstPart}:${secondPart}`;
};

watch(modelValue, (value) => {
    let caretPosition = inputElement.value
        ? (inputElement.value as HTMLInputElement).selectionStart
        : 0;
    modelValue.value = formatInput(value || "00:00");
    caretPosition = caretPosition === 2 ? 3 : caretPosition;
    setCaretPosition(caretPosition);
});
</script>

<style scoped lang="sass"></style>
