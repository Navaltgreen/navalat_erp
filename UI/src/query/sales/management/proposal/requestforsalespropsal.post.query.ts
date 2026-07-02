import { useMutation, useQueryClient } from "@tanstack/react-query";
import { requestSalesProposalMutate } from "../../../../services/sales/management/proposal/requestSalesProposalStatus.post.service";
import { quotationQueryKeys } from "../quotationphase1/get.query";
type RequestProposalPayload = {
  id: number;
  is_converted: boolean;
  proposal_status: "Pending" | "Approved" | "Declined";
};
export function useRequestSalesProposalStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, is_converted, proposal_status }: RequestProposalPayload) =>
      requestSalesProposalMutate(id, { is_converted, proposal_status }),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["proposal"],
      });
      await queryClient.refetchQueries({
        queryKey: quotationQueryKeys.all,
        type: "all",
      });
    },
  });
}
