import {defineStore} from "pinia";
import {ref} from "vue";
import api, {query} from "@/api/instance";

const useOrderFiles = defineStore("orderFiles", () => {
    const files = ref<FileOrder[]>([])
    const loading = ref(false)


    const getAllFilesByOrder = async (orderId: number) => {
        loading.value = true
        files.value = await query<FileOrder[]>(async () => await api.get(`/file/order/${orderId}`), {success: ""}) || [] as FileOrder[]
        loading.value = false
    }

    const saveFile = async (orderId: number, file: FormData) => {
        loading.value = true
        await query(async()=>await api.post(`/file/order/${orderId}`, file))
        await getAllFilesByOrder(orderId)
        loading.value = false
    }
    const deleteFile = async (orderId: number,id: number) => {
        loading.value = true
        await query(async()=>await api.delete(`/file/${id}`))
        await getAllFilesByOrder(orderId)
        loading.value = false
    }
    return ({
        files,
        loading,
        getAllFilesByOrder,
        saveFile,
        deleteFile
    })
})
export default useOrderFiles
