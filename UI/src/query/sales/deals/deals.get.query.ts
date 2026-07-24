import { useQuery } from "@tanstack/react-query";
import { getAllProjects } from "../../../services/oceanix/works/work_add";

export const dealsQueryKeys = {
  all: ["deals"] as const,
  list: () => [...dealsQueryKeys.all] as const,
};

export function useDealsQuery() {
  const query = useQuery({
    queryKey: dealsQueryKeys.list(),
    queryFn: getAllProjects,
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
