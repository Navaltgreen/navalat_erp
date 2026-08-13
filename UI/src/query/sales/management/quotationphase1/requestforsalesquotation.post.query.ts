import { useMutation, useQueryClient } from "@tanstack/react-query";
import { requestSalesQuotationMutate } from "../../../../services/sales/management/quotationphase1/requestSalesQuotationStatus.post.service";
import { quotationQueryKeys } from "../quotationphase2/get.query";
type RequestProposalPayload = {
  id: number;
  phase: number;
};
export function useRequestSalesQuotationStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, phase }: RequestProposalPayload) =>
      requestSalesQuotationMutate(id, { phase }),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["quotationone"],
      });
      await queryClient.refetchQueries({
        queryKey: quotationQueryKeys.all,
        type: "all",
      });
    },
  });
}
