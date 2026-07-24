import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createLead } from "../../../../services/sales/management/leads/createleads.service";

export function useCreateLeadMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createLead,
    

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["leads"],

      });
    },
  });
}
