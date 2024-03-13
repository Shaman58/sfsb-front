import {defineStore} from "pinia";
import {ref} from "vue";
import api, {query} from "@/api/instance";


const useTechnologies = defineStore("techlogies",()=>{
    const technologies = ref<Technology[]>([])

    const fetch = async () =>{
        technologies.value = (await query<Technology[]>(async()=>await api.get("/technology"))) || []
    }
    return {
        technologies,
        fetch
    }
})

export default useTechnologies
export type useTechologiesType = typeof useTechnologies
