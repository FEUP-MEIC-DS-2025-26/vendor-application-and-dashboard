import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://vendor-backend-786191016787.europe-west1.run.app/api',
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
