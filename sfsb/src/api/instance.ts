import axios, { Axios, AxiosResponse } from "axios";
// import Service from "@/plugins/keycloak/service"
import { getToken } from "@josempgon/vue-keycloak";
import checkStatus from "@/mixins/CheckStatus";
import toErrorMessage from "@/mixins/ToErrorMessage";
import { useToast } from "vue-toast-notification";

const toast = useToast();

const baseURL = import.meta.env.VITE_APP_BASE_API_URL;

const instanceOptions = {
    baseURL,
    withCredentials: false,
    headers: {
        accept: "application/json",
    },
};

const api = axios.create(instanceOptions);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Обработка ошибок
        console.error("Ошибка запроса:", error);
        return Promise.reject(error);
    }
);

api.interceptors.request.use(
    async (config) => {
        const token = await getToken();
        console.log(token);
        config.headers["Authorization"] = `Bearer ${token}`;
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;

export interface ErrorMessages {
    success?: string;
    failure?: string;
}

export const query = async <T>(
    cb: () => Promise<AxiosResponse<T, any>>,
    options?: ErrorMessages
): Promise<T | undefined> => {
    const {
        success = "Успешно выполнено!",
        failure = "Ошибка выполнения запроса ",
    } = options || ({} as ErrorMessages);
    try {
        const response = await cb();
        checkStatus(response);
        success && toast.info(success, { position: "top-right" });
        return response.data;
    } catch (error) {
        failure && toast.error(failure);
        toErrorMessage(error);
    }
};

export class CRUD {
    url: string = "";

    constructor(url: string) {
        this.url = url;
        this.fetch = this.fetch.bind(this);
        this.save = this.save.bind(this);
        this.delete = this.delete.bind(this);
        this.deleteAndFetch = this.deleteAndFetch.bind(this);
        this.saveAndFetch = this.saveAndFetch.bind(this);
    }

    async fetch<T>(): Promise<T | undefined> {
        return await query<T>(async () => await api.get(this.url), {
            success: "",
        });
    }

    async save(arg: { id?: number | string }) {
        const url = arg.id ? `${this.url}/${arg.id}` : this.url;
        const method: keyof Axios = arg.id ? "put" : "post";
        const res = await query(async () => await api[method](url, arg));
        return res;
    }

    async saveAndFetch<T>(arg: { id?: number | string }) {
        await this.save(arg);
        return this.fetch<T>();
    }

    async delete(arg: { id: number | string }) {
        await query(async () => await api.delete(`${this.url}/${arg.id}`));
    }

    async deleteAndFetch<T>(arg: { id: number | string }) {
        await this.delete(arg);
        return this.fetch<T>();
    }
}
