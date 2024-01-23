<template lang="pug">
    v-form.material-form(ref="form" v-if="currentTool")
        v-card.material-form__card
            v-card-title.material-form__title {{ currentTool.toolName}} {{ currentTool.description}}
            v-card-text.material-form__controls
                v-text-field.material-form__input(label="Наименование" v-model="currentTool.toolName" )
                v-text-field.material-form__input(label="Описание" v-model="currentTool.description")
            v-card-actions.material-form__actions
                v-btn.material-form__btn {{ newFlag ? "Сохранить" : "Изменить" }}
                v-spacer
                v-btn.material-form__btn(@click="insert") Добавить новый


</template>

<script setup lang="ts">
import {onMounted, type Ref, ref, toRefs, watch} from "vue";

const props = defineProps<{ tool: Tool }>()
const {tool} = toRefs(props)
const form = ref<HTMLFormElement>()

const currentTool: Ref<Partial<Tool>> = ref(props.tool)
const newFlag: Ref<boolean> = ref(false)

onMounted(() => {
    currentTool.value = tool.value
})

watch([tool], () => {
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

</style>
