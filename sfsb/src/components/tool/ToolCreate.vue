<template lang="pug">
    v-dialog(v-model="props.visible")
        v-card
            v-form(ref="form" v-model="valid" @submit.prevent="void save(tool)")
                v-card-text
                    v-row
                        v-col(cols="4")
                            v-text-field(label="Название:" v-model="tool.toolName" :rules="[rules.required, rules.nameValidation]" counter)
                        v-col(cols="4")
                            v-text-field(label="Описание:" v-model="tool.description" :rules="[rules.required]")
                    v-card-actions
                        v-spacer
                        v-btn(color="orange-darken-1" variant="text" @click="hide") Закрыть
                        v-btn(color="orange-darken-1" variant="text" type="submit" :disabled="!valid") Сохранить

</template>

<script setup lang="ts">
import {type Ref, ref} from "vue";
import {useValidationRules} from "@/mixins/FieldValidationRules";

interface Props {
    tool: Tool,
    visible: boolean
}

const props = defineProps<Props>();

const emit = defineEmits(["save", "hide"]);
const {rules} = useValidationRules();

const form: Ref<HTMLFormElement | undefined> = ref();
const valid = ref(false);
const tool = ref({...props.tool});

const save = async (data: Tool) => {
    if (!form.value) return
    const valid: { valid: boolean, errors: Ref<string[]> } = await form.value.valdate()
    if (valid.valid) {
        emit("save", data);
        emit("hide");
    }
};

const hide = () => {
    emit("hide");
    tool.value = {...props.tool};
}

</script>
