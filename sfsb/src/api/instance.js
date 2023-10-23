import axios from "axios";

const instanceOptions = {
  baseURL: 'http://localhost:9001/api',
  // baseURL: 'http://45.12.237.10:9001/api',
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
