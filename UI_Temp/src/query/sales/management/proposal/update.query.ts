import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProposal } from "../../../../services/sales/management/proposal/updateProposal.service";
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
    }) => updateProposal(id, payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["proposal"],
      });
    },
  });
}
