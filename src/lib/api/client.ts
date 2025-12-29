import axios from "axios";
import { apiConfig } from "@/config/site";

export const apiClient = axios.create({
  baseURL: `${apiConfig.baseUrl}/api/${apiConfig.version}`,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000,
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    let message = "An error occurred";
    
    if (error.response?.data?.detail) {
      const detail = error.response.data.detail;
      if (Array.isArray(detail)) {
        message = detail.map((d: { msg?: string; message?: string }) => d.msg || d.message || JSON.stringify(d)).join(", ");
      } else if (typeof detail === "string") {
        message = detail;
      } else {
        message = JSON.stringify(detail);
      }
    } else if (error.message) {
      message = error.message;
    }
    
    if (process.env.NODE_ENV === "development") {
      console.error("API Error:", message);
    }
    
    return Promise.reject(new Error(message));
  }
);
