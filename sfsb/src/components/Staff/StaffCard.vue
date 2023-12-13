<template lang="pug">
v-container
    .person-card
        .person-card__header
            img.person-card__img(:src="personLocal.prependAvatar" alt="avatar" title="Заменить аватар")
            h2.person-card__title
                span {{ personLocal.firstName }}
                span {{ personLocal.lastName }}
                span.person-card__username [ {{ personLocal.userName }} ]
            .person-card__id id: {{ personLocal.id }}
        v-card.person-card__main
            form.person-card__form
                .person-card__form-name
                    v-text-field(label="Имя" v-model="personLocal.firstName")
                    v-text-field(label="Фамилия" v-model="personLocal.lastName")
                .person-card__form-contacts
                    v-text-field(label="Email" v-model="personLocal.email")
                    v-text-field(label="Телефон" v-model="personLocal.phoneNumber")
                .person-card__form-roles
                    v-checkbox(v-for="role in roles" :label="role" v-model="personLocal.roles" :value="role")
            v-card.person-card__pass
                    v-btn.person-card__pass-btn(variant="plain" ) Обновить пароль

        .person-card__footer
            v-btn(prepend-icon="$success" variant="plain") Сохранить
            v-btn(prepend-icon="$error" variant="plain") Отменить изменения
            v-btn(prepend-icon="$info" variant="plain") Удалить пользователя
            v-btn(prepend-icon="$next" variant="plain" @click="emit('exit')") Выйти

</template>

<script setup lang="ts">
import {  reactive, watch } from 'vue';
import roles from "./fakeRolesData"

const {person} = defineProps<{person: Person}>()
const emit = defineEmits(["exit"])

const personLocal: Person | null = reactive(person)

watch(personLocal,(person: Person)=>{
    console.log(person);
})

</script>

<style lang="sass" scoped>
.person-card
    display: flex
    flex-direction: column
    justify-content: space-between
    row-gap: 1rem


    &__header
        display: flex
        align-items: center
        justify-content: space-between

    &__img
        border-radius: 50%
        cursor: pointer
        width: 120px
        height: 120px

    &__title
        display: flex
        gap: 1rem

    &__username
        font-size: 0.9em
        color: #888
        text-align: center

    &__footer
        background: #eee
        margin: 0 -1rem -1rem
        padding: 1rem
        display: flex
        justify-content: space-between

    &__form-name, &__form-contacts
        display: flex
        align-items: center
        justify-content: space-between
        gap: 1rem

    &__form-roles
        display: flex
        align-items: center
        gap: 1rem
        flex-wrap: wrap

    &__pass-btn
        display: block
        margin-inline: auto
</style>
