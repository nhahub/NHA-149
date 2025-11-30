import axios from "axios";
import { safeGetItem, safeSetItem } from "../utils/localStorage.js";
import { APP_CONFIG } from "./app.js";

// Create axios instance
const api = axios.create({
  baseURL: APP_CONFIG.apiBaseUrl,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = safeGetItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      console.log("API Interceptor - 401 error, clearing auth data");
      safeSetItem("token", null);
      safeSetItem("user", null);
      // Dispatch custom event to notify AuthContext
      window.dispatchEvent(new CustomEvent("auth-storage-change"));
    }
    return Promise.reject(error);
  }
);

export default api;
