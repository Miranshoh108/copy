// http/api.js
import axios from "axios";

// Asosiy sozlashlar
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/api";

// Axios instansiyasini yaratish
const $api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 30000, // 30 soniya
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// So'rovdan oldin interceptor
$api.interceptors.request.use(
  (config) => {
    // Tokenni localStoragedan olish
    const token = localStorage.getItem("accessToken");

    // Agar token mavjud bo'lsa, headerga qo'shish
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Javobdan keyin interceptor
$api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Agar 401 xatosi bo'lsa va token yangilash kerak bo'lsa
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Yangi token olish
        const { data } = await axios.post(
          `${API_BASE_URL}/auth/refresh`,
          {},
          {
            withCredentials: true,
          }
        );

        if (data.accessToken) {
          // Yangi tokenni saqlash
          localStorage.setItem("accessToken", data.accessToken);

          // Original so'rovni qayta jo'natish
          originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
          return $api(originalRequest);
        }
      } catch (refreshError) {
        console.error("Token yangilashda xatolik:", refreshError);
        localStorage.removeItem("accessToken");
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

// API metodlari
export default {
  // Auth metodlari
  auth: {
    login: (credentials) => $api.post("/auth/login", credentials),
    register: (userData) => $api.post("/auth/register", userData),
    logout: () => $api.post("/auth/logout"),
    refresh: () => $api.post("/auth/refresh"),
    me: () => $api.get("/auth/me"),
  },

  // Mahsulotlar metodlari
  products: {
    getAll: (params = {}) => $api.get("/products", { params }),
    getById: (id) => $api.get(`/products/${id}`),
    create: (productData) => $api.post("/products", productData),
    update: (id, productData) => $api.put(`/products/${id}`, productData),
    delete: (id) => $api.delete(`/products/${id}`),
  },

  // Savatcha metodlari
  cart: {
    getCart: () => $api.get("/cart"),
    addToCart: (productId, quantity = 1) =>
      $api.post("/cart/add", { productId, quantity }),
    removeFromCart: (productId) => $api.delete(`/cart/remove/${productId}`),
    updateQuantity: (productId, quantity) =>
      $api.put(`/cart/update/${productId}`, { quantity }),
    clearCart: () => $api.delete("/cart/clear"),
  },

  // Buyurtma metodlari
  orders: {
    create: (orderData) => $api.post("/orders", orderData),
    getAll: () => $api.get("/orders"),
    getById: (id) => $api.get(`/orders/${id}`),
    cancel: (id) => $api.put(`/orders/${id}/cancel`),
  },

  // Promokod metodlari
  promo: {
    validate: (code) => $api.post("/promo/validate", { code }),
    apply: (orderId, code) =>
      $api.post(`/orders/${orderId}/apply-promo`, { code }),
  },

  // Fayllar bilan ishlash
  files: {
    upload: (file, config) => {
      const formData = new FormData();
      formData.append("file", file);
      return $api.post("/files/upload", formData, {
        ...config,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    },
    download: (fileId) =>
      $api.get(`/files/download/${fileId}`, {
        responseType: "blob",
      }),
  },

  // Boshqa so'rovlar uchun umumiy metod
  request: (config) => $api(config),
};
