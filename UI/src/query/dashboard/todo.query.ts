import { useQuery } from "@tanstack/react-query";
import { getTodos } from "../../services/dashboard/todo.service";

export const todoQueryKeys = {
  all: ["todos"] as const,
  list: (selectedUserId: number | null) =>
    [...todoQueryKeys.all, { selectedUserId }] as const,
};

export function useTodosQuery(selectedUserId: number | null) {
  const query = useQuery({
    queryKey: todoQueryKeys.list(selectedUserId),
    queryFn: () =>
      getTodos(
        selectedUserId === null ? undefined : { userId: selectedUserId },
      ),
    refetchOnMount: false,
    gcTime: 1000 * 60 * 30,
  });

  return {
    loading: query.isLoading,
    data: query.data ?? [],
    error: query.error ?? null,
    refetch: query.refetch,
  };
}
