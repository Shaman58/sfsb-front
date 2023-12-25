<template lang="pug">
.technology-card__owner
    .technology-card__owner-title Автор: {{ user.firstName }} {{user.lastName }}
    v-switch.technology-card__owner-switcher(v-model="model" label="Взять в работу" color="red")

</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useTechnologyStore } from "@/pinia-store/technology"
import { useCurrentUserStore } from '@/pinia-store/currentUser';
import { storeToRefs } from 'pinia';

interface Props {
    user: Person
}
const { user } = defineProps<Props>()
const emit = defineEmits(["change"])
const model = ref(false)

const { changeBlocked, isEqualTechnolgyUserAndCurrentUser } = useTechnologyStore()
const { user: currentUser } = storeToRefs(useCurrentUserStore())

// model.value = user.id === currentUser.value?.id
model.value = await isEqualTechnolgyUserAndCurrentUser()
console.log("🚀 ~ file: TechnologyCardOwner.vue:25 ~ model.value:", model.value, user.id, currentUser.value)

watch(() => model.value, async (newVal: boolean) => {
    emit("change", newVal)
    await changeBlocked(newVal)
})

</script>

<style lang="sass" scoped>

</style>
