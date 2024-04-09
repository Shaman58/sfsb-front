<template lang="pug">
    .bar
        .bar__warnings
            .bar__warning {{ !isOwner && (kp && kp.createdBy!=="system") ? MESSAGE_IF_STRANGE : "" }}
            .bar__warning {{ isSystem? MESSAGE_IF_SYSTEM : "" }}
        .bar__buttons
            v-btn(
                v-for="i in menuItems"
                :key="i.emit"
                :title="i.label"
                @click="emit(i.emit)"
                :disabled="(disabled && i.canBeDisabled) || (!isOwner && i.disabledWhenStranger) || (isSystem && i.disabledWhenSystem)"
            )
                span {{i.label}}
                v-icon(:icon="i.icon" )

</template>

<script setup lang="ts">
import {computed, toRefs} from "vue";
import {menuItems} from "./KPMenuItems"
import {storeToRefs} from "pinia";
import {useCurrentUserStore} from "@/pinia-store/currentUser";

const emit = defineEmits(["save", "delete", "copy", "download", "print"])
const props = defineProps<{ disabled: boolean, kp: KP | null }>()
const {disabled, kp} = toRefs(props)

const {user} = storeToRefs(useCurrentUserStore())

const MESSAGE_IF_STRANGE = "Вы не являетесь автором КП"
const MESSAGE_IF_SYSTEM = "Данное КП является неизменяемым"
const isOwner = computed(() => {
    if (!user.value || !kp.value) return false
    return user.value.id === kp.value?.createdBy
})
const isSystem = computed(() => !!kp.value?.system)


</script>


<style scoped lang="sass">
.bar
    width: 100%
    display: flex
    align-items: center
    justify-content: space-between
    padding-inline: 1rem

    &__warnings
        display: flex
        flex-direction: column
        align-items: flex-start

    &__warning
        color: red
        text-transform: uppercase
        font-style: italic
        font-size: 12px
</style>
