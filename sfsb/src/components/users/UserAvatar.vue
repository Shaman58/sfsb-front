<template lang="pug">
    label.user-avatar(for="avatar")
        img.user-avatar__img(:src="picture || '/images/user-profile.png'" alt="avatar" title="Заменить аватар")
        input.user-avatar__input(type="file" id="avatar" @change="changeAvatar" hidden  accept="image/*")
</template>
<script setup lang="ts">
import {ref, type Ref, toRefs} from "vue";
import {useToast} from "vue-toast-notification";
import {useStaffStore} from "@/pinia-store/staff";

const toast = useToast()

const props = defineProps<{ picture: string | null, userId?: string }>()
const {picture, userId} = toRefs(props)

const newAvatarFD: Ref<string | Blob | null> = ref(null)
const wasAvatarChanged = ref(false)

const {saveAvatar} = useStaffStore()

const changeAvatar = async (e: Event) => {
    const target = e.target as HTMLInputElement
    target && target.files && console.log(target.files[0])

    if (target.files && target.files[0] && target.files[0].size > 1024 * 1024) return toast.error("Максимальный размер файла 1MB")

    newAvatarFD.value = target.files && target.files[0]

    const reader = new FileReader()
    reader.onload = async (e: any) => {
        console.log(e.target.result);
        picture.value = e.target.result
        wasAvatarChanged.value = true

        const fd = new FormData()
        newAvatarFD.value && fd.append("file", newAvatarFD.value)
        userId.value && await saveAvatar(userId.value, fd)
    }
    target && target.files && reader.readAsDataURL(target.files[0])
};
</script>


<style scoped lang="sass">
.user-avatar

    &__img
        display: block
        border-radius: 50%
        cursor: pointer
        width: 120px
        height: 120px
        object-fit: cover
        margin-inline: auto
</style>
