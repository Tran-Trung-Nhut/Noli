import axios from "axios";

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

export default axiosClient;
