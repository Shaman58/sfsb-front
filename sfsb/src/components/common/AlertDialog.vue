<template lang="pug">
v-dialog(v-model="isShow", width="500")
    v-card(color="orange")
        v-card-title
            span.headline Вы не являетесь автором данной заявки
        v-card-text  При изменении данных данной заявки Вы автоматически станете ее автором.
        v-card-actions
            v-spacer
            v-btn(color="blue" text @click="disagree") Отмена
            v-btn(color="white" text @click="agree") Ок
</template>

<script setup lang="ts">
import { ref } from 'vue';

const isShow = ref(false);
const show = () => { isShow.value = true }
const hide = () => { isShow.value = false }

let agree = () => {}
let disagree = () => {}

const getAnswer = () => new Promise((resolve, reject) => {
        agree = ()=>resolve("ok")
        disagree = ()=>reject()
    })

defineExpose({ show, hide, getAnswer })
</script>
