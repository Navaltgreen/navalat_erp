import { useMutation, useQueryClient } from "@tanstack/react-query";
import { requestSalesProposalMutate } from "../../../../services/sales/management/proposal/requestSalesProposalStatus.post.service";
import { proposalQuotationsQueryKeys } from "./quotations.query";
import { quotationQueryKeys } from "../quotationphase1/get.query";
import { quotationQueryKeys as purchaseQueryKeys } from "../purchase/get.query";
type RequestProposalPayload = {
  id: number;
  is_converted: boolean;
  proposal_status?: "Pending" | "Approved" | "Declined";
  amount?: number;
  remarks?: string;
  pic?: string;
};
export function useRequestSalesProposalStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...payload }: RequestProposalPayload) =>
      requestSalesProposalMutate(id, payload),

    onSuccess: async (_, variables) => {
      await queryClient.invalidateQueries({
        queryKey: ["proposal"],
      });
      await queryClient.invalidateQueries({
        queryKey: proposalQuotationsQueryKeys.list(variables.id),
      });
      await queryClient.invalidateQueries({
        queryKey: purchaseQueryKeys.all,
      });
      await queryClient.refetchQueries({
        queryKey: proposalQuotationsQueryKeys.list(variables.id),
        type: "active",
      });
      await queryClient.refetchQueries({
        queryKey: purchaseQueryKeys.all,
        type: "all",
      });
      await queryClient.refetchQueries({
        queryKey: quotationQueryKeys.all,
        type: "all",
      });
    },
  });
}
