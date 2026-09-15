import axios from "axios";
import { BASE_URL } from "./apiPath";

//create axios instance
export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 80000, //request timeout
  headers: {
    "Content-Type": "application/json",
  },
});

//request interceptor to add token to requests
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

//response interceptor to handle errors
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      if (error.response.status === 500) {
        console.error("Something went wrong. Please try again later.");
      }
      if (error.code === "ECONNABORTED") {
        console.error("Request timeout.Please try again.");
      }
    }
    return Promise.reject(error);
  },
);
