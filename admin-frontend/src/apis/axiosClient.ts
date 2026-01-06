import axios from "axios";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_DOMAIN || "https://noli-gwua.onrender.com", 
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosClient;
