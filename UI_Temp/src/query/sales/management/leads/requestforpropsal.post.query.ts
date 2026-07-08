import { useMutation, useQueryClient } from "@tanstack/react-query";
import { requestProposalStatus } from "../../../../services/sales/management/leads/requestProposalStatus.post.service";
import { proposalsQueryKeys } from "../proposal/get.query";
import type { requestProposalBody } from "../../../../types/sales/leads/requestProposal.request";

type RequestProposalPayload = {
  id: number;
  is_converted: boolean;
  lead_status: "Approved" | "Declined" | "Pending";
  name?: string;
  title?: string;
  division?: string;
  client?: string;
  email?: string;
  phone?: string;
  proposal_number?: string;
  pic_for_proposal?: number;
};
export function useRequestProposalStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...payload }: RequestProposalPayload) =>
      requestProposalStatus(id, payload as requestProposalBody),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["leads"],
      });
      await queryClient.refetchQueries({
        queryKey: proposalsQueryKeys.all,
        type: "all",
      });
    },
  });
}
