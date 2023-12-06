<template>
  <v-col cols="12">
    <v-file-input clearable label="File input" @change="addFile($event)" ref="fileInput"></v-file-input>
    <v-list>

      <v-list-item v-for="n in localFiles" :key="n">
        <div class="file-link">
          <a :href="n.link" class="file-link__link">
            {{ n.filename }}
          </a>
          <v-icon class="file-link__delete" @click="deleteFile(n)">mdi-close</v-icon>
        </div>
      </v-list-item>

    </v-list>
  </v-col>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const {order: orderId} = defineProps<{order: string|number}>()

const fileInput = ref(null)

const localFiles = ref<OrderFile[]>([])
const newFiles = ref<OrderFile[]>([])
const deletedFiles = ref<OrderFile[]>([])

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

const saveFiles = async () => {
  const fd = new FormData()
  // newFiles.value.length && newFiles.value.forEach(e=>fd.append("addedFile[]",e.file))
  // deletedFiles.value.length && deletedFiles.value.forEach(e=>fd.append("deletedFile[]",e.file))


  if (fileInput.value) {
    const fileElement = fileInput.value as HTMLInputElement
    // fileElement.files && [...fileElement.files].forEach(file=> fd.append("file[]",file))
    fileElement.files && fd.append("file", fileElement.files[0])

    await api.post(`/file/${order.value.id}`, fd)
  }

}

const addFile = (event: Event) => {
  const { value, files } = event.target as HTMLInputElement
  files && localFiles.value.push(createOrderFileElement(files[0].name, files[0]))
  files && newFiles.value.push(createOrderFileElement(files[0].name, files[0]))

  // saveFiles()
};

const deleteFile = (n: OrderFile) => {
  const fileToDelete = props.order.files.find(e => e.filename === n.filename)
  fileToDelete && deletedFiles.value.push(fileToDelete)
  localFiles.value = localFiles.value.filter(e => e.id !== n.id)

  console.log(deletedFiles, newFiles);
}
</script>
