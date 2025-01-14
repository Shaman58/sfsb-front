import axios from "axios";

const baseURL = import.meta.env.VITE_APP_BASE_API_URL+'/order';

const instanceOptions = {
    baseURL,
    withCredentials: false,
    headers: {
        accept: "application/json",
    },
};

const ordersApi = axios.create(instanceOptions);
export default ordersApi;
