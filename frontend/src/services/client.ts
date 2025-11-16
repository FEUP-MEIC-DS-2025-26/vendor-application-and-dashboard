import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  timeout: 8000,
  headers: {
    "Accept": "application/json",
    "Content-Type": "application/json",
  },
});

// You can optionally add interceptors here later
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.code === "ECONNABORTED") {
      error.message = "Request timeout - backend may not be running";
    }
    throw error;
  }
);
