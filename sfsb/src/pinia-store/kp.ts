import {defineStore} from "pinia";
import {ref, watch} from "vue";
import api, {query} from "@/api/instance";

export const useKPStore
    = defineStore("kp", () => {
    const loading = ref(false)
    const pages = ref<KP[][]>([[]])
    const kp = ref<KP[]>([])
    const currentPage = ref(0)
    const LIMIT = 20
    watch(pages, () => {
        kp.value = pages.value.flat()
    }, {deep: true})


    const withLoading = async (cb: () => void | Promise<any>) => {
        loading.value = true
        await cb()
        loading.value = false
    }
    const fetch = async () => await withLoading(async () => {
        const response = await query(
            async () => await api.get(`http://5.35.84.165:9000/api/order?offset=${currentPage.value}&limit=${LIMIT}`),
            {success: ""}
        )
        if ("content" in response) {
            if (response.content.length === 0) {
                currentPage.value = 0
                return
            }
            pages.value[currentPage.value] = response.content
        }
        if ("totalPages" in response) {
            console.log("response.totalPages", response.totalPages)
        }
        if ("totalElements" in response) {
            console.log("response.totalElements", response.totalElements)
        }

    })

    const next = async () => {
        currentPage.value += 1
        await fetch()
    }


    const get = async <T>(id: number) => {
        loading.value = true
        const res = await query<T>(
            async () => await api.get("http://5.35.84.165:9000/api/order/" + id),
            {success: ""}
        )
        loading.value = false
        return res
    }
    const save = async <T>(kp: KP) => {
        loading.value = true
        const method = "id" in kp ? "put" : "post"
        const res = await query<T>(
            async () => await api[method]("http://5.35.84.165:9000/api/order" + (kp.id ? "/" + kp.id : ""), kp),
        )
        loading.value = false
        await fetch()
        return res
    }

    return {
        loading,
        kp,
        pages,
        fetch,
        get,
        save,
        next
    }
});

export type KPStoreType = typeof useKPStore
