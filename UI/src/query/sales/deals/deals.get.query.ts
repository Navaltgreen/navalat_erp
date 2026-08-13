import { useQuery } from "@tanstack/react-query";
import { getAllProjects } from "../../../services/oceanix/works/work_add";

export const dealsQueryKeys = {
  all: ["deals"] as const,
  list: (module?: string) => [...dealsQueryKeys.all, { module }] as const,
};

export function useDealsQuery(module?: string) {
  const query = useQuery({
    // queryKey: dealsQueryKeys.list(),
    // queryFn: getAllProjects,
    queryKey: dealsQueryKeys.list(module),
    queryFn: () => (module ? getAllProjects(module) : getAllProjects()),
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
