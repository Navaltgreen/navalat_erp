import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateQuotation } from "../../../../services/sales/management/quotationphase1/updateQuotation.service";
import type { CreateProposalRequest } from "../../../../types/sales/proposal/proposal.post.request";

export function useUpdateProposalMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number;
      payload: CreateProposalRequest;
    }) => updateQuotation(id, payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["quotationone"],
      });
    },
  });
}
