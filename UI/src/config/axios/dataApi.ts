import axios from "axios";
import { ensureKeycloakToken, loginWithKeycloak } from "../keycloak";
import { useAuthStore } from "../../store/auth/store";

export const dataApi = axios.create({
  baseURL: import.meta.env.VITE_DATA_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

dataApi.interceptors.request.use(async (config) => {
  const token = await ensureKeycloakToken(30);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

type QueueEntry = {
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
};

let isRefreshing = false;
let failedQueue: QueueEntry[] = [];

function processQueue(error: unknown, token: string | null = null): void {
  failedQueue.forEach((entry) => {
    if (error) {
      entry.reject(error);
    } else {
      entry.resolve(token!);
    }
  });
  failedQueue = [];
}

dataApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise<string>((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return dataApi(originalRequest);
        })
        .catch((err) => Promise.reject(err));
    }

    originalRequest._retry = true;
    isRefreshing = true;

    const { clearAuth, setLastAttemptedPath } = useAuthStore.getState();
    const attemptedPath = window.location.pathname;

    try {
      const token = await ensureKeycloakToken(0);

      if (!token) {
        throw new Error("Missing access token");
      }

      processQueue(null, token);
      originalRequest.headers.Authorization = `Bearer ${token}`;
      return dataApi(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError);
      setLastAttemptedPath(attemptedPath);
      clearAuth();

      try {
        await loginWithKeycloak(attemptedPath);
      } catch {
        // Redirect could be blocked in some browsers; keep local state cleared.
      }

      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);
