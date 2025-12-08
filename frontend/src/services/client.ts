import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://api.madeinportugal.store/api',
  timeout: 8000,
  headers: {
    "Accept": "application/json",
    "Content-Type": "application/json",
  },
});

// add interceptors here later
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.code === "ECONNABORTED") {
      error.message = "Request timeout - backend may not be running";
    }
    throw error;
  }
);
