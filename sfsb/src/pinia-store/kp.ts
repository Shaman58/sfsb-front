import {defineStore} from "pinia";
import {computed, ref} from "vue";
import api, {query} from "@/api/instance";

export const useKPStore
    = defineStore("kp", () => {
    const loading = ref(false)
    const pages = ref<KP[][]>([[]])
    const currentPage = ref(0)
    const LIMIT = 20
    const kp = computed(() => pages.value.flat())
    const total = computed(() => kp.value.length)
    const blocked = ref(false)
    const URL = "http://cp-api.ra58.ru:9000/api/order"


    const withLoading = async (cb: () => void | Promise<any>) => {
        loading.value = true
        await cb()
        loading.value = false
    }
    const fetch = async () => await withLoading(async () => {
        const response = await query(
            async () => await api.get(`${URL}?offset=${currentPage.value}&limit=${LIMIT}`),
            {success: ""}
        )
        if (response && "content" in response) {
            pages.value[currentPage.value] = response.content
        }
        if (response && "totalElements" in response) {
            const thatsAll = +response.totalElements <= total.value
            blocked.value = thatsAll
            thatsAll ? currentPage.value = 0 : currentPage.value += 1
        }

    })

    const next = async () => {
        if (loading.value || blocked.value) return
        await fetch()
    }


    const get = async <T>(id: number) => {
        loading.value = true
        const res = await query<T>(
            async () => await api.get(`${URL}/${id}`),
            {success: ""}
        )
        loading.value = false
        return res
    }
    const save = async <T>(kp: KP) => {
        loading.value = true
        const method = "id" in kp ? "put" : "post"
        const res = await query<T>(
            async () => await api[method](URL + (kp.id ? "/" + kp.id : ""), kp),
        )
        loading.value = false
        if (method === "post") {
            blocked.value = false
            await fetch()
        }

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
