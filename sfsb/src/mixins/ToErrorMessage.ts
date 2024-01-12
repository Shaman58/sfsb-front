import {AxiosError} from "axios";
import {useToast} from "vue-toast-notification";

const toast = useToast()
const isErrorAxios = (err:any): err is AxiosError =>{
    return "response" in err && "data" in err.response;
}
const toErrorMessage=(err:any) =>{
    const data: any = isErrorAxios(err) && (err as AxiosError).response?.data
    const isDataArray = Array.isArray(data)
    if(data && isDataArray) {
        data.forEach(e=>{
            toast.error(e?.info)
        })
    }
    if(data && !isDataArray && "info" in data) {
        toast.error(data.info)
    }
    if(!data){
        toast.error(err)
    }
}

export default toErrorMessage
