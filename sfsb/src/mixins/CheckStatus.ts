import {AxiosResponse} from "axios";

const checkStatus = (response: AxiosResponse<any, any>) =>{
    if(response.status >= 400) throw Error(response.data ? response.data.info : response.statusText)
}

export default checkStatus
