import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateLead } from "../../../../services/sales/management/leads/updateLead.service";
import type { CreateLeadRequest } from "../../../../types/sales/leads/leads.post.request";
export function useUpdateLeadMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: CreateLeadRequest }) =>
      updateLead(id, payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["leads"],
      });
    },
  });
}
