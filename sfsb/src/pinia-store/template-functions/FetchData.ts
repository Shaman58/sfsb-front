import api from "@/api/instance";

export default async function fetchData<T>(target: T, url: string, errorcb: (error: unknown)=>void){
    try {
        const { data } = await api.get<T>(url);
        target = data
    } catch (error) {
        errorcb(error)
    }
}
