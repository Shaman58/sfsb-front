import axios from "axios";

const baseURL = "http://31.129.97.108:9000/api/tasks";

const instanceOptions = {
    baseURL,
    withCredentials: false,
    headers: {
        accept: "application/json",
    },
};

const tasksApi = axios.create(instanceOptions);
export default tasksApi;
