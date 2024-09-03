import axios from "axios";

const baseURL = "http://31.129.97.108:9000/api/workflow";

const instanceOptions = {
    baseURL,
    withCredentials: false,
    headers: {
        accept: "application/json",
    },
};

const workflowApi = axios.create(instanceOptions);
export default workflowApi;
