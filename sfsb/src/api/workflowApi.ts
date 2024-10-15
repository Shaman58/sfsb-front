import axios from "axios";
import { getToken } from "@josempgon/vue-keycloak";

const baseURL = "http://31.129.97.108:9000/api/workflow";

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
