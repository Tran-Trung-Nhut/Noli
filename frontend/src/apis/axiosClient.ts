import axios from "axios";
import { hasLoggedIn } from "../utils";

let getAccessToken: (() => string | null) | null = null

export const setAccessTokenGetter = (getter: () => string | null) => {
  getAccessToken = getter
}

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_DOMAIN,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosClient.interceptors.request.use((config) => {

  const accessToken = getAccessToken ? getAccessToken() : null;

  if (accessToken && config.headers) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

axiosClient.interceptors.response.use(
  result => result,
  error => {
    if (error.response.status === 401) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("userInfo");
      if (hasLoggedIn()) return window.location.reload();

      window.location.href = '/login?error=Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại';
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
