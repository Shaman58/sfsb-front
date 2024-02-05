<template lang="pug">
    LayoutMain.user-card
        template(#header)
            v-btn(prepend-icon="$success" variant="plain" @click="save" color="green" :disabled="!wasPersonChanged || !isValidForm") Сохранить
            v-btn(prepend-icon="$error" variant="plain"  @click="reset") Отменить изменения
            v-btn(prepend-icon="$info" variant="plain"  @click="deletePerson" color="red") Удалить пользователя
        v-form(id="person-form" ref="personForm")
            .person-card
                .person-card__header
                    label.person-card__picture(for="avatar")
                        img.person-card__img(:src="personLocal.picture ? personLocal.picture : '/images/user-profile.png'" alt="avatar" title="Заменить аватар")
                        input.person-card__input(type="file" id="avatar" @change="void changeAvatar($event)" hidden)
                    h2.person-card__title
                        span {{ personLocal.firstName }}
                        span {{ personLocal.lastName }}
                        span.person-card__username [ {{ personLocal.username }} ]
                v-card.person-card__main
                    form.person-card__form
                        .person-card__form-name
                            v-text-field(label="username" v-model="personLocal.username" :rules="[required]" v-if="!personLocal.id")
                            v-text-field(label="Имя" v-model="personLocal.firstName" :rules="[required]")
                            v-text-field(label="Фамилия" v-model="personLocal.lastName" :rules="[required]")
                        .person-card__form-contacts
                            v-text-field(label="Email" v-model="personLocal.email" :rules="[emailValidation]")
                        .person-card__form-roles
                            v-checkbox(v-for="role in roles" :label="role" v-model="personLocal.roles" :value="role")
        template(#footer)
            v-card.person-card__pass
                v-btn.person-card__pass-btn(variant="plain" @click="showChangePass=true") Изменить пароль



                v-dialog(v-model="showChangePass")
                    v-card
                        v-card-title Заменить пароль
                        v-card-text
                            v-text-field(label="Новый пароль" v-model="newPass" type="password")
                            v-text-field(label="Повторите новый пароль" v-model="newPassRepeat" type="password"  :rules="[newPassRepeat===newPass||'Ошибка! Пароли не совпадают']")
                        v-card-actions
                            v-btn(color="primary" variant="plain" @click="changePass") Сохранить
                            v-btn(color="error" variant="plain" @click="showChangePass=false") Отменить

</template>
<script setup lang="ts">
import LayoutMain from "@/components/common/LayoutMain.vue"
import {useRoute} from "vue-router";
import {computed, type ComputedRef, toRefs} from "vue";
import {storeToRefs} from "pinia";
import {useStaffStore} from "@/pinia-store/staff"
import emptyUser from "./EmptyUser"

const {params, path} = toRefs(useRoute())

const {staff} = storeToRefs(useStaffStore())
const {getAllStaff} = useStaffStore()
!staff.value.length && await getAllStaff()

const personLocal: ComputedRef<Person> = computed(() => params.value.id === "new"
    ? emptyUser()
    : staff.value.find(e => e.id === params.value.id) || staff.value[0]
)

const required = (v: string) => !!v.length || "Поле обязательно для заполнения"
const emailValidation = (value: string) => {
    const pattern = /^\w+([.-]?\w+){2,}@\w+([.-]?\w+)*(\.\w{2,5})+$/
    return value === "" || pattern.test(value) || 'Неверный формат'
}
const changeAvatar = async (event: Event) => {
}
const save = async (event: Event) => {
}
const reset = async (event: Event) => {
}
const deletePerson = async (event: Event) => {
}
</script>

<style scoped lang="sass">

</style>
