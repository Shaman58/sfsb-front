import axios, {AxiosResponse} from "axios";
import Service from "@/plugins/keycloak/service"
import checkStatus from "@/mixins/CheckStatus";
import toErrorMessage from "@/mixins/ToErrorMessage";
import {useToast} from "vue-toast-notification";

const toast = useToast()

const baseURL = import.meta.env.VITE_APP_BASE_API_URL;

const instanceOptions = {
    baseURL,
    withCredentials: false,
    headers: {
        accept: 'application/json'
    }
};

const api = axios.create(instanceOptions);

api.interceptors.response.use(
    response => response,
    error => {
        // Обработка ошибок
        console.error('Ошибка запроса:', error);
        return Promise.reject(error);
    }
);

api.interceptors.request.use((config) => {
    const token = Service.getTocken()
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
}, error => Promise.reject(error))

export default api;

interface ErrorMessages {
    success: string,
    failure: string
}

export const query: T = async (cb: () => Promise<AxiosResponse<T, any>>, options?: Partial<ErrorMessages>) => {
    try {
        const response = await cb()
        checkStatus(response)
        toast.info(options && options.success || "Успешно выполнено!", {position: "top-right"});
        return response.data
    } catch (error) {
        toast.error(options && options.failure || "Ошибка выполнения запроса ");
        toErrorMessage(error)
    }
}
