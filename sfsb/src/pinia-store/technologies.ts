import {defineStore} from "pinia";
import {ref} from "vue";
import api, {query} from "@/api/instance";


const useTechnologies = defineStore("techlogies",()=>{
    const technologies = ref<Technology[]>([])

    const fetch = async () =>{
        technologies.value = (await query<Technology[]>(async()=>await api.get("/technology"),{success:""})) || []
        console.log(technologies.value.map(e=>e.drawingNumber))
        technologies.value = technologies.value.toSorted((a,b)=>(a.drawingNumber < b.drawingNumber?-1:1))
        console.log(technologies.value.map(e=>e.drawingNumber))
    }
    return {
        technologies,
        fetch
    }
})

export default useTechnologies
export type useTechologiesType = typeof useTechnologies
