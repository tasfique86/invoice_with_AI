import axios from "axios";
import { BASE_URL } from "./apiPath";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 80000,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      if (error.response.status === 500) {
        console.error("Something went wrong. Please try again later.");
      }
      if (error.code === "ECONNABORTED") {
        console.error("Request timeout. Please try again.");
      }
    }
    return Promise.reject(error);
  },
);

export { axiosInstance };
export default axiosInstance;
