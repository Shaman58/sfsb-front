<template lang="pug">
    v-form.material-form(ref="form"  @submit.prevent="save")
        v-card.material-form__card
            v-card-title.material-form__title
                span.material-form__title-name {{ currentTool.toolName}}
                span.material-form__title-description {{ currentTool.description}}
            v-card-text.material-form__controls
                .material-form__controls-content
                    v-text-field.material-form__input(label="Наименование" v-model="toolName" :rules="[rules.required, rules.nameValidation]")
                    v-text-field.material-form__input(label="Описание" v-model="description")
            v-card-actions.material-form__actions
                v-btn.material-form__btn(type="submit") {{ newFlag ? "Сохранить" : "Изменить" }}


</template>

<script setup lang="ts">
import {useRoute} from "vue-router";
import {storeToRefs} from "pinia";
import {useCurrentTool, useToolingStore} from "@/pinia-store/tools";
import {onUnmounted, ref, watchEffect} from "vue";
import {useValidationRules} from "@/mixins/FieldValidationRules";
import emptyTool from "@/components/data-page/EmptyTool";

const route = useRoute()

const {rules} = useValidationRules();


const {currentTool: currentType} = storeToRefs(useCurrentTool())

const currentTool = ref((currentType.value?.list.find(e => e.id + "" === route.params.id) || currentType.value?.list[0] )as Tool)
const newFlag = ref(route.params.id === "new")

const toolName = ref(currentTool.value?.toolName || "")
const description = ref(currentTool.value?.description || "")

const save = async () => {
    currentType.value && await currentType.value.save({
        ...currentTool.value,
        description: description.value,
        toolName: toolName.value
    } as Material & Tool)
}

const unwatchRouter = watchEffect(() => {
    if (route.params.id === 'new') {
        currentTool.value = emptyTool() as Tool
    } else {
        currentTool.value = (currentType.value?.list.find(e => e.id + "" === route.params.id) || currentType.value?.list[0] )as Tool
    }
    if (!currentTool.value) return
    toolName.value = currentTool.value.toolName
    description.value = currentTool.value.description
    newFlag.value = route.params.id === "new"
})


onUnmounted(() => {
    unwatchRouter()
})

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
            font-size: clamp(12px, 16 / 768 * 100vw, 16px)

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
