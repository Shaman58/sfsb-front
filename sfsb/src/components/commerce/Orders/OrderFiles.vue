<template lang="pug">
    .order-files
        v-progress-linear(v-if="loading" :indeterminate="true" :color="$defaultColor")
        .order-files__container
            label.order-files__new(for="new-file" title="Добавить файл")
                v-icon(color="orange-lighten-1") mdi-plus
                input#new-file(type="file" hidden)
            v-list.order-files__list
                v-list-item.order-files__list-item(v-for='(file, index) in files', :key='index')
                    a.order-files__list-link(:href="file.link" target="_blank") {{file.filename}}
                    v-icon(color="orange" @click.stop="removeFile(file)") mdi-close

</template>
<script setup lang="ts">

import {onUnmounted, toRefs, watch} from "vue";
import {storeToRefs} from "pinia";
import useOrderFiles from "@/pinia-store/orderFiles";

const props = defineProps<{ orderId: number }>()
const {orderId} = toRefs(props)

const {files, loading} = storeToRefs(useOrderFiles())
const {getAllFilesByOrder} = useOrderFiles()
!files.value.length && await getAllFilesByOrder(orderId.value)

const removeFile = (file: any) => {
}

const unwatch =watch([orderId], async () => {
    await getAllFilesByOrder(orderId.value)
})

onUnmounted(unwatch)
</script>


<style scoped lang="sass">
.order-files

    &__container
        height: 100%
        display: flex
        gap: 0.5rem

    & > *
        border-radius: 0.5rem

    &__new
        flex: 0 0 70px
        background-color: rgb(var(--v-theme-surface-light))
        display: grid
        place-items: center
        cursor: pointer

    &__list
        flex: 1 1 100%
        padding: 0.5rem
        overflow-x: auto
        display: flex
        flex-direction: column
        gap: 0.5rem
        scroll-snap-type: y mandatory
        scroll-behavior: smooth

        & > *
            scroll-snap-align: center

        &::-webkit-scrollbar
            height: 4px
            background-color: transparent

        &::-webkit-scrollbar-thumb
            height: 4px
            background-color: var(--scroll-color)
            border-radius: 8px


    &__list-item
        box-shadow: 0 2px 6px -2px #7777
        transition: box-shadow 0.4s ease-in-out
        cursor: pointer

        &:hover
            box-shadow: 0 2px 6px 0px #7777

    &__list-link
        text-decoration: none
</style>
