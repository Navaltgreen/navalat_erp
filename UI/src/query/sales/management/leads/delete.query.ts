import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteLead } from "../../../../services/sales/management/leads/deleteLead.service";

export function useDeleteLeadMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteLead(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["leads"],
      });
    },
  });
}
