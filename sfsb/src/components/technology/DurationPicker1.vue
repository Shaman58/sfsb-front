<template>
     <v-text-field
        :value="modelValue"
        :label="label"
        placeholder="00:00"
        @input="handleInput"
        :rules="rules"
        ref="input"
     ></v-text-field>
</template>

<script setup lang="ts">
import { Ref, computed, ref } from 'vue';


interface Props{
    modelValue: string;
    label: string;
    rules: ((v: string) => boolean| string)[];
}

const {modelValue, label, rules} = defineProps<Props>()
const emit = defineEmits(["update:modelValue"])

const input = ref(null)

const cursorPos: Ref<number | null> = ref(0)

const computedRules = computed(() => [...rules])

const handleInput=(e: InputEvent)=>{
    const target = e.target as HTMLInputElement
    let result = target.value
    cursorPos.value = target.selectionStart

    let [left, right] = result.split(":")
    left = left.replace(/[^0-9]/g, "").slice(0,2)
    right = right.replace(/[^0-9]/g, "").slice(0,2)

    left = left.padStart(2,"0")
    right = right.padStart(2,"0")

    right = +right > 59 ? "5" + right[1]: right


    result=left + ":" + right
    emit("update:modelValue", result)
    target.setSelectionRange(cursorPos.value, cursorPos.value)
    //TODO: доделать
}
</script>
