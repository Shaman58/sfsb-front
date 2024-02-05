<template lang="pug">
    .order-files
        label.order-files__new(for="new-file" title="Добавить файл")
            v-icon(color="orange-lighten-1") mdi-plus
            input#new-file(type="file" hidden)
        v-list.order-files__list
            v-list-item.order-files__list-item(v-for='(file, index) in files', :key='index')
                a.order-files__list-link(:href="file.link" target="_blank") {{file.filename}}
                v-icon(color="orange" @click.stop="removeFile(file)") mdi-close

</template>
<script setup lang="ts">

import {toRefs, watch} from "vue";
import {storeToRefs} from "pinia";
import useOrderFiles from "@/pinia-store/orderFiles";

const props = defineProps<{ orderId: number }>()
const {orderId} = toRefs(props)

const {files} = storeToRefs(useOrderFiles())
const {getAllFilesByOrder} = useOrderFiles()
!files.value.length && await getAllFilesByOrder(orderId.value)

const removeFile = (file: any) => {
}

watch([orderId], async () => {
    await getAllFilesByOrder(orderId.value)
})
</script>


<style scoped lang="sass">
.order-files
    height: 100%
    display: flex
    gap: 0.5rem

    & > *
        border-radius: 0.5rem

    &__new
        flex: 0 0 70px
        background-color: #fff
        display: grid
        place-items: center
        cursor: pointer

    &__list
        flex: 1 1 100%
        padding: 0.5rem
        overflow-x: auto
        display: flex
        gap: 0.5rem
        scroll-snap-type: x mandatory
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
        background-color: #444
        border-radius: 2rem
        color: white

    &__list-link
        text-decoration: none
        color: #fff
</style>
