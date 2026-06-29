import { useMutation, useQueryClient } from "@tanstack/react-query";
import { requestSalesProposalMutate } from "../../../../services/sales/management/proposal/requestSalesProposalStatus.post.service";
import { quotationQueryKeys } from "../quotationphase1/get.query";
type RequestProposalPayload = {
  id: number;
  is_converted: boolean;
};
export function useRequestSalesProposalStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, is_converted }: RequestProposalPayload) =>
      requestSalesProposalMutate(id, { is_converted }),

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
