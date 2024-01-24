<template lang="pug">
    v-form.material-form(ref="form" v-if="currentTool")
        v-card.material-form__card
            v-card-title.material-form__title
                span.material-form__title-name {{ currentTool.toolName}}
                span.material-form__title-description {{ currentTool.description}}
            v-card-text.material-form__controls
                .material-form__controls-content
                    v-text-field.material-form__input(label="Наименование" v-model="currentTool.toolName" )
                    v-text-field.material-form__input(label="Описание" v-model="currentTool.description")
            v-card-actions.material-form__actions
                v-btn.material-form__btn {{ newFlag ? "Сохранить" : "Изменить" }}
                v-spacer
                v-btn.material-form__btn(@click="insert" color="orangered") Добавить новый


</template>

<script setup lang="ts">
import {onMounted, type Ref, ref, toRefs, watchEffect} from "vue";

const props = defineProps<{ tool: Partial<Tool> }>()
const {tool} = toRefs(props)
const form = ref<HTMLFormElement>()

const currentTool: Ref<Partial<Tool>> = ref(props.tool)
const newFlag: Ref<boolean> = ref(false)

onMounted(() => {
    currentTool.value = tool.value
})

watchEffect(() => {
    console.log("tool props", tool)
    currentTool.value = tool.value
    newFlag.value = false
})

const insert = () => {
    currentTool.value = {
        toolName: "",
        description: ""
    }
    newFlag.value = true
}
</script>


<style scoped lang="sass">
.material-form
    height: 100%

    &__card
        height: 100%
        display: grid
        grid-template-rows: 50px 1fr 50px

    &__title
        display: flex
        gap: 1rem

    &__title-name
        font-size: 1.1rem
        font-weight: 700

    &__title-description
        font-size: 0.95rem
        font-weight: 200
        color: #0009

    &__controls
        display: grid
        place-items: center stretch
</style>
