import axios from "axios";
import {getToken} from "@josempgon/vue-keycloak";

const baseURL = import.meta.env.VITE_APP_BASE_ALT_URL +'/workflow';

const instanceOptions = {
    baseURL,
    withCredentials: false,
    headers: {
        accept: "application/json",
    },
};

const workflowApi = axios.create(instanceOptions);
workflowApi.interceptors.request.use(
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
export default workflowApi;
