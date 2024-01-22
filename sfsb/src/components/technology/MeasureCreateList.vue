<template lang="pug">
    v-dialog(v-model="props.visible" :persistent="true")
        v-card
            v-form(ref="form" v-model="valid" @submit.prevent="save(toolItem)")
                v-card-title
                    span.text-h5 Меритель:

                v-card-text
                    v-container(v-if="tools.length!==0")
                        v-list
                            v-list-item(v-for="(tool, index) in tools" :key="index" :title="tool.tool.toolName +'   '+ tool.tool.description" :subtitle="tool.amount+'шт.'")
                                template(#append)
                                    v-btn( color="orange-lighten-1" icon="mdi-delete" variant="text" @click.stop="remove(index)")

                    v-container
                        v-row
                            v-col(cols="4")
                                v-text-field(
                                    label="Название:"
                                    v-model="toolItem.tool.toolName"
                                    :rules="[rules.required, rules.nameValidation]"
                                    counter)
                            v-col(cols="4")
                                v-text-field(
                                    label="Описание:"
                                    v-model="toolItem.tool.description"
                                    :rules="[rules.required, rules.nameValidation]"
                                    counter)

                            v-col(cols="4")
                                v-text-field(
                                    label="Количество:"
                                    v-model="toolItem.amount"
                                    :rules="[rules.required, rules.minValidation]"
                                    counter)
                            v-col(cols="4")
                                v-text-field(
                                    label="Ориентировочная стоимость:"
                                    v-model="toolItem.price.amount"
                                    :rules="[rules.required, rules.counter]"
                                    counter
                                    type="number"
                                    maxlength="20")

                v-card-actions
                    v-spacer
                    v-btn(color="orange-darken-1" variant="text" @click="hide") Закрыть
                    v-btn(color="orange-darken-1" variant="text" type="submit" :disabled="!valid") Добавить


</template>

<script setup lang="ts">
import {ref, toRefs} from "vue";
import {useValidationRules} from "@/mixins/FieldValidationRules";

interface Props {
    visible: boolean
    tools: Partial<ToolItem>[]
}

const props = defineProps<Props>();
const {tools, visible} = toRefs(props);
const emit = defineEmits(["hide"]);

const {rules} = useValidationRules();
const form = ref(null);
const valid = ref(false);

const initToolItem = {tool: {toolName: "", description: ""}, price: {currency: "RUB", amount: 0}, amount: 0}
const toolItem = ref(initToolItem);

const hide = () => {
    emit('hide');
};

const save = (savedTool: typeof toolItem.value) => {
    tools.value.push({...savedTool} as ToolItem);
    toolItem.value = initToolItem;
};

const remove = (index: number) => {
    tools.value.splice(index, 1);
};
</script>


