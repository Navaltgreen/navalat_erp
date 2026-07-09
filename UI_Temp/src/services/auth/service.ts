import axios from "axios";
import { authApi } from "../../config/axios/authApi";
import type { LoginRequest } from "../../types/auth/login.request";
import type { LoginResponse } from "../../types/auth/login.response";
import type { RefreshRequest } from "../../types/auth/refresh.request";
import type { RefreshResponse } from "../../types/auth/refresh.response";

const LOGIN_ENDPOINT =
  import.meta.env.VITE_AUTH_LOGIN_ENDPOINT ?? "/auth/login";

const REFRESH_ENDPOINT =
  import.meta.env.VITE_AUTH_REFRESH_ENDPOINT ?? "/auth/refresh";

const refreshApi = axios.create({
  baseURL: import.meta.env.VITE_AUTH_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

export async function loginUser(payload: LoginRequest): Promise<LoginResponse> {
  const response = await authApi.post<LoginResponse>(LOGIN_ENDPOINT, payload);
  return response.data;
}

export async function refreshTokenService(
  payload: RefreshRequest,
): Promise<RefreshResponse> {
  const response = await refreshApi.post<RefreshResponse>(
    REFRESH_ENDPOINT,
    payload,
  );
  return response.data;
}
