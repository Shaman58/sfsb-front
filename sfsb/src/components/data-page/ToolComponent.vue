<template lang="pug">
    v-form.material-form(ref="form" v-if="currentTool" @submit.prevent="save")
        v-card.material-form__card(:loading="loading")
            v-card-title.material-form__title
                span.material-form__title-name {{ currentTool.toolName}}
                span.material-form__title-description {{ currentTool.description}}
            v-card-text.material-form__controls
                .material-form__controls-content
                    v-text-field.material-form__input(label="Наименование" v-model="currentTool.toolName" :rules="[rules.required, rules.nameValidation]")
                    v-text-field.material-form__input(label="Описание" v-model="currentTool.description")
            v-card-actions.material-form__actions
                v-btn.material-form__btn(type="submit") {{ newFlag ? "Сохранить" : "Изменить" }}
                v-spacer
                v-btn.material-form__btn(@click="insert" color="orange" :disabled="newFlag") Добавить новый


</template>

<script setup lang="ts">
import {onMounted, onUnmounted, type Ref, ref, toRefs, watchEffect} from "vue";
import {useValidationRules} from "@/mixins/FieldValidationRules";
import {useToolingStore} from "@/pinia-store/tools";
import {storeToRefs} from "pinia";

const props = defineProps<{ item: Partial<Tool> }>()
const {item} = toRefs(props)

const emit = defineEmits(["save"])

const form = ref<HTMLFormElement>()

const {rules} = useValidationRules();

const currentTool: Ref<Partial<Tool>> = ref(item.value)
const newFlag: Ref<boolean> = ref(false)

const {loading} = storeToRefs(useToolingStore())

const save = async () => {
    if (!form.value) return
    const valid: { valid: boolean, errors: Ref<string[]> } = await form.value?.validate()
    if (valid.valid) {
        emit("save", currentTool.value)
        newFlag.value = false
    }
}

onMounted(() => {
    currentTool.value = item.value
})

const unwatch = watchEffect(() => {
    console.log("item props", item)
    currentTool.value = item.value
    newFlag.value = false
})

const insert = () => {
    currentTool.value = {
        toolName: "",
        description: ""
    }
    newFlag.value = true
}

onUnmounted(unwatch)
</script>


<style scoped lang="sass">
.material-form
    height: 100%

    &__card
        height: 100%
        overflow-y: auto
        display: grid
        grid-template-rows: 90px 1fr 50px

    &__title
        display: flex
        gap: 1rem
        @media (width < 768px)
            flex-wrap: wrap
            row-gap: 0
            font-size: clamp(12px, 16 / 768 * 100vw,16px)

    &__title-name
        font-size: 1.1em
        font-weight: 700

    &__title-description
        font-size: 0.95em
        font-weight: 200
        opacity: 0.5

    &__controls
        display: grid
        place-items: center stretch
</style>
