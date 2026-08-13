import { useQuery } from "@tanstack/react-query";
import { getQuotationRecords } from "../../../../services/sales/management/quotationphase3/fetchData.service";

export const quotationQueryKeys = {
  all: ["quotationthree"] as const,
  list: () => [...quotationQueryKeys.all] as const,
};

export function useLeadsQuery() {
  const query = useQuery({
    queryKey: quotationQueryKeys.list(),
    queryFn: getQuotationRecords,
    refetchOnMount: false,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
  });

  return {
    loading: query.isLoading,
    data: query.data,
    error: query.error,
    refetch: query.refetch,
  };
}
