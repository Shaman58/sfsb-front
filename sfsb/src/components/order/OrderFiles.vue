<template>

  <v-card cols="12" class="files-card">
    <template #title>Прикрепленые файлы</template>
    <v-file-input clearable label="Выберите файл" @change="saveFile" ref="fileInput" class="file-input"></v-file-input>
    <transition-group tag="ul" class="list" name="files">

      <li v-for="n in files" :key="n.filename" class="list-item">
        <v-icon>mdi-file-outline</v-icon>
        <div class="file-link">
          <a :href="n.link" class="file-link__link" target="_blank" type="image/*">
            {{ n.filename }}
          </a>
          <v-icon class="file-link__delete" @click="deleteFile(n)" title="удалить">mdi-close</v-icon>
        </div>
      </li>

    </transition-group>
  </v-card>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
// import api from '../../api/instance';
import { useStore } from 'vuex';

const {dispatch,getters} = useStore()

const {order: orderId} = defineProps<{order: string|number}>()

const fileInput = ref<HTMLInputElement|null>(null)

const files = computed<OrderFile[]>(() => getters.getAllFiles)

onMounted(async ()=>{

 dispatch("getAllFilesByOrder",orderId)

})

const createOrderFileElement = (name: string, file: File): OrderFile & { file: File } => {
  return {
    created: new Date().toLocaleTimeString(),
    filename: name,
    id: Date.now(),
    link: "",
    updated: "",
    file
  }
}

const saveFile = () => {
  const fd = new FormData()
  fileInput.value && fileInput.value.files  && fd.append("file", fileInput.value.files[0])
  dispatch("addFile", fd)
}

const deleteFile = (n: OrderFile) => {
  console.log("n",n);
  dispatch("deleteFile",n.id)
}
</script>

<style scoped lang="sass">

.files-move
    transition: transform 0.5s
.files-card
    padding: 1rem
    width: 100%
.file-link
    display: flex
    align-items: center
    width: fit-content
    gap: 0.5rem

    &__delete
        color: red
        cursor: pointer
        scale: 1
        transition: scale 0.5s

    &__link
        display: block
        color: var(--v-theme-primary)
        text-decoration: none
        font-style: italic
        transition: color 0.5s

    &:hover
        color: -webkit-link

.list
    display: flex
    flex-wrap: wrap
    list-style: none
    padding-left: 0
    gap: 0.5rem 1rem
.list-item
    flex: 1 1 calc(50% - 1rem)
    min-height: 24px
    position: relative
    display: flex
    align-items: center
    column-gap: 4px

    &:hover
        & .file-link__delete
            scale: 1.3

        &::before
            width: 100%
            left: 0

    &::before
        content: ""
        position: absolute
        left: 50%
        top: 100%
        width: 0%
        height: 1px
        background: linear-gradient(to right, #0000,blue,#0000)
        transition: width 0.5s, left 0.5s


</style>
