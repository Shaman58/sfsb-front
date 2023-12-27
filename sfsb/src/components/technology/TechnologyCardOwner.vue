<template lang="pug">
.technology-card__owner
    .technology-card__owner-title
        span(v-if="technologyUser") Последние изменения внесены: {{ technologyUser.firstName }} {{technologyUser.lastName }}
        span(v-else="technologyUser" ) Данные не были внесены
    v-switch.technology-card__owner-switcher(v-model="model" :label="model?'В работе':'Взять в работу'" color="red" :untouchable="currentItem.technology.blocked!=='' || !isBlockedByCurrentUser")

</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useTechnologyStore } from "@/pinia-store/technology"
import { useCurrentUserStore } from '@/pinia-store/currentUser';
import { storeToRefs } from 'pinia';

const emit = defineEmits(["change"])

const { isBlockedByCurrentUser, currentItem } = storeToRefs(useTechnologyStore())
const { changeBlocked } = useTechnologyStore()
const { user: currentUser } = storeToRefs(useCurrentUserStore())

const model = ref(isBlockedByCurrentUser.value)

const technologyUser = currentItem.value.technology.user

// model.value = user.id === currentUser.value?.id
model.value = isBlockedByCurrentUser.value

watch(() => model.value, async (newVal: boolean) => {
    emit("change", newVal)
    await changeBlocked(newVal)
})

</script>

<style lang="sass" scoped>

</style>
