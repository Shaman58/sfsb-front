<template lang="pug">
    .order-files(@click="onClick")
        v-progress-linear(v-if="loading" :indeterminate="true" :color="$defaultColor")
        .order-files__container(:class="{editable:canEdit}" )
            label.order-files__new(for="new-file" title="Добавить файл" )
                v-icon(color="orange-lighten-1" ) mdi-plus
                input#new-file(ref="inputElement" type="file" hidden @change="saveOrderFile" accept="image/*,.pdf,.xls,.xlsx,.doc,.docx" )
            v-list.order-files__list
                v-list-item.order-files__list-item(v-for='(file, index) in files', :key='index')
                    a.order-files__list-link(:href="file.link" target="_blank") {{file.filename}}
                    v-icon(color="orange" @click.stop="removeFile(file.id)") mdi-close

</template>
<script setup lang="ts">
import { onUnmounted, ref, toRefs, watch } from "vue";
import { storeToRefs } from "pinia";
import useOrderFiles from "@/pinia-store/orderFiles";
import { useToast } from "vue-toast-notification";

const toast = useToast();

const props = defineProps<{ orderId: number | undefined; canEdit: boolean }>();
const { orderId, canEdit } = toRefs(props);

const inputElement = ref<HTMLInputElement>();

const { files, loading, error } = storeToRefs(useOrderFiles());
const { getAllFilesByOrder, saveFile, deleteFile, clearError } =
    useOrderFiles();
await getAllFilesByOrder(orderId.value);

const removeFile = async (file: number) => {
    await deleteFile(orderId.value, file);
};

const saveOrderFile = async (ev: Event) => {
    const { files } = ev.target as HTMLInputElement;
    if (!files || !files.length) return;
    const fd = new FormData();
    fd.append("file", files[0]);
    await saveFile(orderId.value, fd);
};

const onClick = () => {
    if (!canEdit.value)
        toast.error("У вас не доступа для изменения этого блока");
};
const unwatch = watch([orderId], async () => {
    console.log("orderId.value", orderId.value);
    orderId.value && (await getAllFilesByOrder(orderId.value));
});

const unwatchError = watch([error], () => {
    console.error(error.value);
    console.log(inputElement.value);
    if (inputElement.value) {
        (inputElement.value as HTMLInputElement).value = "";
        // (inputElement.value as HTMLInputElement).files = ;
    }
    clearError();
});

onUnmounted(() => {
    unwatch();
    unwatchError();
});
</script>

<style scoped lang="sass">
.order-files

    &__container
        height: 100%
        display: flex
        gap: 0.5rem
        opacity: 0.3
        pointer-events: none

        &.editable
            opacity: 1
            pointer-events: all

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
