import { useMutation } from "@tanstack/react-query";
import { loginUser } from "../../services/auth/service";
import type { LoginRequest } from "../../types/auth/login.request";

export function useLoginMutation() {
  const mutation = useMutation({
    mutationFn: (payload: LoginRequest) => loginUser(payload),
  });

  return {
    login: mutation.mutate,
    loginAsync: mutation.mutateAsync,
    loading: mutation.isPending,
    error: mutation.error ?? null,
    data: mutation.data ?? null,
    reset: mutation.reset,
  };
}
