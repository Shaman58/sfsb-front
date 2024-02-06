<template lang="pug">
    LayoutMain.user-card
        template(#header)
            v-card.user-card__toolbar
                ControlButton(@click="deletePerson"  tooltip="Удалить пользователя" icon-name="mdi-delete")
                ControlButton(@click="reset"  tooltip="Отменить изменения" icon-name="mdi-refresh")
                ControlButton(@click="save" color="orange-darken-1" variant="text" type="submit" :disabled=" !isValidForm" tooltip="Сохранить" icon-name="mdi-floppy")
        v-card.user-card__main
            v-form(id="person-form" ref="personForm")

                .user-card__header
                    UserAvatar.user-card__picture(:picture="personLocal.picture" :user-id="personLocal.id")
                    h2.user-card__title
                        span {{ personLocal.firstName }}
                        span {{ personLocal.lastName }}
                        span.user-card__username [ {{ personLocal.username }} ]
                v-card.user-card__main
                    form.user-card__form
                        .user-card__form-name
                            v-text-field(label="username" v-model="personLocal.username" :rules="[required]" v-if="!personLocal.id")
                            v-text-field(label="Имя" v-model="personLocal.firstName" :rules="[required]")
                            v-text-field(label="Фамилия" v-model="personLocal.lastName" :rules="[required]")
                        .user-card__form-contacts
                            v-text-field(label="Email" v-model="personLocal.email" :rules="[emailValidation]")
                        .user-card__form-roles
                            v-checkbox(v-for="(role, index) in roles" :label="role" :value="role" v-model="personLocal.roles" :key="role")
        template(#footer)
            v-card.user-card__footer
                v-btn(variant="text" @click="showChangePass=true") Изменить пароль

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
import {computed, type Ref, ref, toRefs, watch, watchEffect} from "vue";
import {storeToRefs} from "pinia";
import {useStaffStore} from "@/pinia-store/staff"
import emptyUser from "./EmptyUser"
import {useRolesStore} from "@/pinia-store/roles";
import ControlButton from "@/components/commerce/Orders/ControlButton.vue";
import {useToast} from "vue-toast-notification";
import UserAvatar from "@/components/users/UserAvatar.vue";

const toast = useToast();

const {params, path} = toRefs(useRoute())

const {staff} = storeToRefs(useStaffStore())
const {getAllStaff, saveStaff, deleteStaff} = useStaffStore()
!staff.value.length && await getAllStaff()

const {roles} = storeToRefs(useRolesStore())
const {getAllRoles} = useRolesStore()
!roles.value.length && await getAllRoles()

const emptyUserWithRoles = () => {
    const user = emptyUser()
    user.roles = roles.value
    return user
}

const personLocal: Ref<Person> = ref(staff.value[0])

const wasPersonChanged = ref(false)
const isValidForm = computed(() => {
    return !!personLocal.value.firstName.length
        && !!personLocal.value.lastName.length
})

const showChangePass = ref(false)

const newPass = ref("")
const newPassRepeat = ref("")

const personForm = ref<HTMLFormElement>()

const required = (v: string) => !!v.length || "Поле обязательно для заполнения"
const emailValidation = (value: string) => {
    const pattern = /^\w+([.-]?\w+){2,}@\w+([.-]?\w+)*(\.\w{2,5})+$/
    return value === "" || pattern.test(value) || 'Неверный формат'
}

const changePass = () => {
    if (newPass.value !== newPassRepeat.value) return toast.error("Пароли не совпадают")
    personLocal.value.password = newPass.value
    showChangePass.value = false
}


const save = async () => {
    console.log("personLocal from component", personLocal.value);
    if (!isValidForm.value) return toast.error("Поля не заполнены")
    if (!personLocal.value.password) return toast.error("Вы забыли задать пароль")
    await saveStaff(personLocal.value)
}
const reset = async (event: Event) => {
    await getAllStaff()
}
const deletePerson = async (event: Event) => {
    await deleteStaff(personLocal.value)
}

watch([personLocal], () => {
    console.log("personLocal", personLocal.value, isValidForm.value)
}, {deep: true})

watchEffect(() => {
    console.log("params", params.value)
    personLocal.value = params.value.id === "new" ? emptyUser() as Person : (staff.value.find(e => e.id === params.value.id) || staff.value[0])

})
</script>

<style scoped lang="sass">
.user-card

    &__toolbar
        width: 100%
        display: flex
        align-items: center
        justify-content: flex-end
        height: 100%

    &__main
        padding: 1rem
        height: 100%

    &__header
        display: grid
        grid-template-columns: 120px 1fr
        place-items: center

    &__picture
        flex: 0 0 40%


    &__title
        display: flex
        gap: 1rem

    &__username
        font-size: 0.9em
        color: #888
        text-align: center

    &__footer
        padding-inline: 1rem
        width: 100%
        height: 100%
        display: grid
        place-items: center start

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


</style>
