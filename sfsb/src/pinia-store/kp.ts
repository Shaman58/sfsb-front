import {defineStore} from "pinia";
import {ref} from "vue";
import api, { query} from "@/api/instance";

export const useKPStore
    = defineStore("kp", () => {
    const loading = ref(false)
    const offset = ref(0)
    const limit = ref(20)
    const kp = ref<KP[]>([])


    const withLoading = async (cb: () => void | Promise<any>) => {
        loading.value = true
        await cb()
        loading.value = false
    }
    const fetch = async () => await withLoading(async () => {
        const response = await query(async () => await api.get("http://5.35.84.165:9000/api/order"),
            {success:""}
        )
        if ("content" in response) {
            kp.value = response.content
        }
    })

    const get = async <T>(id: number) => {
        loading.value = true
        const res = await query<T>(
            async () => await api.get("http://5.35.84.165:9000/api/order/" + id),
            {success:""}
        )
        loading.value = false
        return res
    }
    const save = async <T>(kp: KP) => {
        loading.value = true
        const method = "id" in kp ? "put" : "post"
        const res = await query<T>(
            async () => await api[method]("http://5.35.84.165:9000/api/order" + (kp.id?"/"+kp.id:""), kp),
        )
        loading.value = false
        return res
    }


    return {
        loading,
        kp,
        fetch,
        get,
        save
    }
});

export type KPStoreType = typeof useKPStore
