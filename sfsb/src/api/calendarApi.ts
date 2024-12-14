import axios from "axios";
import { getToken } from "@josempgon/vue-keycloak";

const baseURL = "http://31.129.97.108:9000/api/calendar";

const instanceOptions = {
    baseURL,
    withCredentials: false,
    headers: {
        accept: "application/json",
    },
};

const calendarApi = axios.create(instanceOptions);
calendarApi.interceptors.request.use(
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
export default calendarApi;
