import api from "@/api/instance";


export default async function Delete<T extends {id: number}>(data: T, address: string, successcb?: ()=> void, errorcb?:(err:unknown)=>void){
   try {
    const url = `/${address}/${data.id}`;
    await api.delete(url);
    successcb && successcb()
   } catch (error) {
    errorcb && errorcb(error)
   }
}
