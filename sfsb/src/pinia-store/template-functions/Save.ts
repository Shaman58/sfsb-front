import api from "@/api/instance";

export default async function Save<T extends {id: number}>(data: T, name: string, errorcb: (error: unknown)=>void){
    try {
        const url = data.id ? `/${name}/${data.id}`: `/${name}`;
        data.id ? await api.put(url, data) : await api.post(url, data);
    } catch (error) {
        errorcb(error)
    }
}
