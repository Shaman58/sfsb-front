import {defineStore} from "pinia";
import {ref} from "vue";
import api, {query} from "@/api/instance";

const useOrderFiles = defineStore("orderFiles", () => {
    const files = ref<FileOrder[]>([])
    const loading = ref(false)

    const fakeData = [[18098, 2587687, 38098098090, 45765786578, 5897987987], [6699593433, 7908098, 8, 96789987], [1098798, 1146553, 129879868, 139879868, 142323, 1597809, 169070987, 17897698]]

    const getAllFilesByOrder = async (orderId: number) => {
        loading.value = true
        files.value = await query<FileOrder[]>(async () => await api.get(`/file/order/${orderId}`), {success: ""}) || [] as FileOrder[]
        loading.value = false
    }
    return ({
        files,
        getAllFilesByOrder
    })
})
export default useOrderFiles
