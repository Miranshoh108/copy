import axios from "axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

const $api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

$api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (process.env.NODE_ENV === "development") {
      process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

$api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === "ENOTFOUND") {
      console.error("Server topilmadi:", error.config?.baseURL);
      return Promise.reject(new Error("Server bilan aloqa o'rnatilmadi"));
    }

    if (error.code === "ECONNABORTED") {
      console.error("So'rov vaqti tugadi:", error.message);
      return Promise.reject(new Error("So'rov vaqti tugadi"));
    }

    if (error.response?.status === 500) {
      console.error("Server xatosi:", error.response.data);
      return Promise.reject(new Error("Server xatosi"));
    }

    return Promise.reject(error);
  }
);

export default $api;
