import axios from "axios";
import Service from "@/plugins/keycloak/service"

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

api.interceptors.request.use((config)=>{
  console.log("config", config);
  console.log("document.cookie",document.cookie)
  return config
}, error=>Promise.reject(error))

export default api;
