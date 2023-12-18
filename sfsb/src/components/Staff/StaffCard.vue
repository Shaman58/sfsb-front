<template lang="pug">
v-container.person-card__container
    v-form(id="person-form" ref="personForm")
        .person-card
            .person-card__header
                label.person-card__picture(for="avatar")
                    img.person-card__img(:src="personLocal.picture ? personLocal.picture : '/images/default-avatar.jpg'" alt="avatar" title="Заменить аватар")
                    input.person-card__input(type="file" id="avatar" @change="changeAvatar($event)" hidden)
                h2.person-card__title
                    span {{ personLocal.firstName }}
                    span {{ personLocal.lastName }}
                    span.person-card__username [ {{ personLocal.username }} ]
            v-card.person-card__main
                form.person-card__form
                    .person-card__form-name
                        v-text-field(label="username" v-model="personLocal.username" :rules="[required]" v-if="!person.id")
                        v-text-field(label="Имя" v-model="personLocal.firstName" :rules="[required]")
                        v-text-field(label="Фамилия" v-model="personLocal.lastName" :rules="[required]")
                    .person-card__form-contacts
                        v-text-field(label="Email" v-model="personLocal.email" :rules="[required, emailValidation]")
                    .person-card__form-roles
                        v-checkbox(v-for="role in roles" :label="role" v-model="personLocal.roles" :value="role")
                v-card.person-card__pass
                    v-btn.person-card__pass-btn(variant="plain" @click="showChangePass=true") Изменить пароль

            .person-card__footer
                v-btn(prepend-icon="$success" variant="plain" @click="save" color="green" :disabled="!wasPersonChanged || !isValidForm") Сохранить
                v-btn(prepend-icon="$error" variant="plain"  @click="reset") Отменить изменения
                v-btn(prepend-icon="$info" variant="plain"  @click="deletePerson" color="red") Удалить пользователя
                v-btn(prepend-icon="$next" variant="plain" @click="emit('exit')" color="blue") Выйти

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
import { reactive, watch, ref, computed } from 'vue';
import type { Ref } from "vue"
// import roles from "./fakeRolesData"
import { useToast } from 'vue-toast-notification';
import { useStaffStore } from '@/pinia-store/staff'
import { useRolesStore } from '@/pinia-store/roles'
import { storeToRefs } from 'pinia'
import { useValidationRules } from "@/mixins/FieldValidationRules";

const personForm = ref(null)
const newAvatarFD: Ref<string | Blob | null> = ref(null)

const toast = useToast();
const staffStore = useStaffStore()

const rolesStore = useRolesStore()
const { roles } = storeToRefs(rolesStore)

const { person } = defineProps<{ person: Person }>()
const emit = defineEmits(["exit"])

let personLocal: Person = reactive({ ...person })

const wasPersonChanged = ref(false)
const wasAvatarChanged = ref(false)

const showChangePass = ref(false)

const newPass = ref("")
const newPassRepeat = ref("")

const required = (v: string) => !!v.length || "Поле обязательно для заполнения"
const { rules:{emailValidation} } = useValidationRules()

const isValidForm = computed(() => !!personLocal.firstName.length
                            && !!personLocal.lastName.length
                            && emailValidation(personLocal.email)===true)

const changePass = () => {
    if (newPass.value !== newPassRepeat.value) return toast.error("Пароли не совпадают")
    personLocal.password = newPass.value
    showChangePass.value = false
}

const changeAvatar = async (e: Event) => {
    const target = e.target as HTMLInputElement
    target && target.files && console.log(target.files[0])

    newAvatarFD.value = target.files && target.files[0]

    const reader = new FileReader()
    reader.onload = async (e: any) => {
        console.log(e.target.result);
        personLocal.picture = e.target.result
        wasAvatarChanged.value = true

        const fd = new FormData()
        newAvatarFD.value && fd.append("file", newAvatarFD.value)
        await staffStore.saveAvatar(personLocal.id, fd)
    }
    target && target.files && reader.readAsDataURL(target.files[0])
};

const save = async () => {
    console.log("personLocal from component", personLocal);
    if (!isValidForm) return toast.error("Поля не заполнены")
    if(!person.username && !personLocal.password) return toast.error("Вы забыли задать пароль")
    const isSuccess = await staffStore.saveStaff(personLocal)
    emit("exit")
}

const reset = () => {
    Object.keys(personLocal).forEach((e) => {
        const val = e as keyof Person
        if (val === "roles") {
            personLocal.roles = person.roles
        } else {
            personLocal[val] = person[val]
        }
    })
}

const deletePerson = async () => {
    await staffStore.deleteStaff(personLocal)
    emit("exit")
}

watch(personLocal, (personValue: Person) => {
    wasPersonChanged.value = true
    console.log(personValue);
})

</script>

<style lang="sass" scoped>
.person-card
    display: flex
    flex-direction: column
    justify-content: space-between
    row-gap: 1rem


    &__header
        display: grid
        grid-template-columns: 120px 1fr
        place-items: center

    &__picture
        flex: 0 0 40%

    &__img
        display: block
        border-radius: 50%
        cursor: pointer
        width: 120px
        height: 120px
        object-fit: cover
        margin-inline: auto

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
