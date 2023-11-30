import axios from "axios";

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

export default api;
