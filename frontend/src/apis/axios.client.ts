import axios, { AxiosError, type AxiosRequestConfig } from "axios";
import authApi from "./auth.api";

let getAccessToken: (() => string | null) | null = null
let setAccessToken: ((accessToken: string) => void) | null = null

export const setAccessTokenGetter = (getter: () => string | null) => {
  getAccessToken = getter
}


export const setAccessTokenSetter = (setter: (accessToken: string) => void | null) => {
  setAccessToken = setter
}



const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_DOMAIN,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosClient.interceptors.request.use((config) => {

  if (config.headers?.Authorization) {
    return config;
  }

  const accessToken = getAccessToken ? getAccessToken() : null;

  if (accessToken && config.headers) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

axiosClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError & { config?: AxiosRequestConfig & { _retry?: boolean } }) => {
    const originalRequest = error.config;
    // If no response or not 401 -> reject
    if (!error.response ||
      error.response.status !== 401 ||
      (error.response.status === 401 &&
        error.response.data &&
        typeof error.response.data === "object" &&
        "message" in error.response.data &&
        (error.response.data as { message?: string }).message === 'Refresh token không tồn tại, vui lòng đăng nhập lại')) {
      return Promise.reject(error);
    }

    if (error.response.status === 401 &&
      error.response.data &&
      typeof error.response.data === "object" &&
      "message" in error.response.data &&
      (error.response.data as { message?: string }).message === 'Token không hợp lệ') {
      if (window.location.pathname === "/profile") window.location.href = "/login?warning=expired-refresh-token"
      return Promise.reject(error)
    }

    // Avoid infinite loop: if already retried, reject
    if (originalRequest && originalRequest._retry) {
      return Promise.reject(error);
    }

    if (!originalRequest) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      const response = await authApi.refresh()

      if (response.data.message === 'Token không hợp lệ') window.location.href = "/login"

      const newToken = response.data.accessToken ?? null;
      if (!newToken) {
        if (window.location.pathname !== '/login') window.location.href = "/login?warning=expired-refresh-token";
        return Promise.reject(new Error("Không nhận được access token khi refresh"));
      }

      axiosClient.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;

      if (originalRequest.headers) {
        originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
      } else {
        originalRequest.headers = { Authorization: `Bearer ${newToken}` } as any;

      }

      if (setAccessToken) {
        setAccessToken(newToken)
      }
      return axiosClient(originalRequest);
    } catch (err) {

      if (window.location.pathname !== '/login') window.location.href = "/login?warning=expired-refresh-token";

      return Promise.reject(err);
    }
  }
);

export default axiosClient;
