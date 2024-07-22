<template lang="pug">
    .technology-card__owner
        .technology-card__owner-title
            .technology-card__owner-changes(v-if="technologyUser")
                span Последние изменения внесены:
                span {{ technologyUser.firstName }} {{technologyUser.lastName }}
            span(v-else="technologyUser" ) Данные не были внесены
        .technology-card__owner-switcher(:untouchable="untouchable")
            v-switch(v-model="model" :label="model?'В работе':'Взять в работу'" color="red" )

</template>

<script setup lang="ts">
import {computed, ref, watch} from 'vue';
import {useTechnologyStore} from "@/pinia-store/technology"
import {storeToRefs} from 'pinia';

const emit = defineEmits(["change"])

const {isBlockedByCurrentUser, currentItem} = storeToRefs(useTechnologyStore())
const {changeBlocked} = useTechnologyStore()

const model = ref(isBlockedByCurrentUser.value)

const technologyUser = currentItem.value.technology.user

const untouchable = computed(() => !!currentItem.value.technology.blocked && !isBlockedByCurrentUser.value)

model.value = isBlockedByCurrentUser.value

watch(() => model.value, async (newVal: boolean) => {
    emit("change", newVal)
    await changeBlocked(newVal)
})

</script>

<style lang="sass" scoped>
.technology-card
    &__owner-changes
        display: flex
        column-gap: .5em
        flex-wrap: wrap
        font-size: clamp(14px, 20 / 1024 * 100vw, 20px)

        @media (width < 600px)
            line-height: 1

</style>
