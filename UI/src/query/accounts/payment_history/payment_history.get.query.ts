import { useQuery } from "@tanstack/react-query";
import { getPaymentAllHistory } from "../../../services/accounts/payment_history/payment_history.get.service";
import type { PaymentAllHistoryResponse } from "../../../types/accounts/payment_history/payment_history.response";

export const PaymentHistoryQueryKeys = {
  all: ["payment-all-history"] as const,
  list: (
    projectId: number | null,
    startDate?: string | null,
    endDate?: string | null,
  ) =>
    [
      ...PaymentHistoryQueryKeys.all,
      {
        projectId,
        startDate,
        endDate,
      },
    ] as const,
};

export function useAllPaymentHistory(
  projectId: number | null,
  startDate?: string | null,
  endDate?: string | null,
) {
  const query = useQuery({
    queryKey: ["milestone-history", projectId, startDate, endDate],
    queryFn: () =>
      startDate && endDate
        ? getPaymentAllHistory(projectId!, startDate, endDate)
        : getPaymentAllHistory(projectId!),

    enabled: projectId !== null,
    refetchOnMount: false,
    gcTime: 1000 * 60 * 30,
  });

  return {
    loading: query.isLoading,
    // data: query.data ?? [],
    data: query.data as PaymentAllHistoryResponse | undefined,
    error: query.error ?? null,
    refetch: query.refetch,
  };
}
